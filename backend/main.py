# uvicorn backend.main:app --reload
import os
import shutil
import tempfile
import logging
from typing import Any, Dict, List, Literal, Optional, TypedDict, cast
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pywal import colors, export as pywal_export  # type: ignore

logging.basicConfig(level=logging.INFO)
logger: logging.Logger = logging.getLogger("backend")

app: FastAPI = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SpecialColors(TypedDict):
    background: str
    foreground: str
    cursor: str


class ColorPalette(TypedDict):
    color0: str
    color1: str
    color2: str
    color3: str
    color4: str
    color5: str
    color6: str
    color7: str
    color8: str
    color9: str
    color10: str
    color11: str
    color12: str
    color13: str
    color14: str
    color15: str


class PaletteResponse(TypedDict):
    colors: ColorPalette
    special: SpecialColors
    wallpaper: str
    checksum: str
    alpha: str


class ExportRequest(BaseModel):
    colors: Dict[str, str]
    special: SpecialColors
    template_type: str
    custom_template: Optional[str] = None


class ExportResponse(TypedDict):
    content: str
    template_type: str


# Explicit typing of constants
AVAILABLE_BACKENDS: List[str] = list(
    colors.list_backends())  # type: ignore[attr-defined]
DEFAULT_BACKEND: str = "wal"


@app.post("/generate-palette")
async def generate_palette(
    file: UploadFile = File(...),
    backend: str = Form(DEFAULT_BACKEND),
    light: bool = Form(False),
    sat: str = Form(""),
    c16: Optional[Literal["lighten", "darken"]] = Form(None),
    cst: Optional[float] = Form(None)
) -> PaletteResponse:
    """
    Generate a color palette from an image.

    Args:
        file: Image uploaded by the user
        backend: Pywal backend to use (default: "wal")
        light: Generate light mode palette instead of dark (default: False)
        sat: Saturation adjustment, e.g., "0.5" for 50% (default: "")
        c16: Generate 16 colors using "lighten" or "darken" method (default: None)
        cst: Contrast ratio to apply, e.g., 1.5 (default: None)

    Returns:
        Dictionary with the generated colors

    Raises:
        HTTPException: If there are errors in the process
    """
    logger.info(
        "Incoming request: file=%s, backend=%s, light=%s, sat=%s, c16=%s, cst=%s",
        file.filename if file else None,
        backend,
        light,
        sat,
        c16,
        cst
    )

    # Validate backend
    if backend not in AVAILABLE_BACKENDS:
        logger.warning("Unsupported backend: %s", backend)
        raise HTTPException(
            status_code=400,
            detail=f"Backend '{backend}' is not supported. Available: {', '.join(AVAILABLE_BACKENDS)}"
        )

    # Save temporary image
    image_path: str = ""
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as tmp:
            shutil.copyfileobj(file.file, tmp)
            image_path = tmp.name
        logger.info("Temporary image saved at %s", image_path)
    except Exception as e:
        logger.exception("Failed to save uploaded image")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save image: {str(e)}"
        ) from e

    # Generate palette
    try:
        try:
            # Build kwargs for colors.get()
            kwargs: Dict[str, Any] = {}
            if c16 is not None:
                kwargs["c16"] = c16
            if cst is not None:
                kwargs["cst"] = cst

            # Cast to expected type since pywal doesn't have type stubs
            palette: Dict[str, Any] = cast(
                Dict[str, Any],
                colors.get(  # type: ignore[attr-defined]
                    image_path,
                    backend=backend,
                    light=light,
                    sat=sat,
                    **kwargs
                )
            )
        except SystemExit as se:
            raise HTTPException(
                status_code=500,
                detail=f"Missing dependency for backend '{backend}'"
            ) from se

        logger.info(
            "Palette generated successfully using backend '%s'",
            backend
        )

        # Extract colors with validation
        colors_dict: Dict[str, str] = palette.get("colors", {})
        special_dict: Dict[str, str] = palette.get("special", {})
        wallpaper: str = palette.get("wallpaper", "")
        checksum: str = palette.get("checksum", "")
        alpha: str = palette.get("alpha", "100")

        if not colors_dict:
            raise HTTPException(
                status_code=500,
                detail="No colors found in palette"
            )

        if not special_dict:
            raise HTTPException(
                status_code=500,
                detail="No special colors found in palette"
            )

        return PaletteResponse(
            colors=cast(ColorPalette, colors_dict),
            special=cast(SpecialColors, special_dict),
            wallpaper=wallpaper,
            checksum=checksum,
            alpha=alpha
        )

    except HTTPException:
        # Re-raise HTTPException without wrapping
        raise
    except Exception as e:
        logger.exception(
            "Error generating palette for backend '%s'",
            backend
        )
        raise HTTPException(
            status_code=500,
            detail=str(e)
        ) from e
    finally:
        # Cleanup temporary file
        if image_path and os.path.exists(image_path):
            os.remove(image_path)
            logger.info("Temporary image deleted: %s", image_path)


@app.post("/export-template")
async def export_template(
    request: ExportRequest
) -> ExportResponse:
    """
    Export colors using pywal templates.

    Args:
        request: Export request with colors, special colors, template type and optional custom template

    Returns:
        Dictionary with exported content and template type

    Raises:
        HTTPException: If there are errors in the export process
    """
    logger.info(
        "Export request: template_type=%s, has_custom_template=%s",
        request.template_type,
        request.custom_template is not None
    )

    template_path: str = ""
    output_path: str = ""

    try:
        # Reconstruct full color structure for pywal
        full_colors: Dict[str, Any] = {
            "wallpaper": "",
            "checksum": "",
            "alpha": "100",
            "special": request.special,
            "colors": request.colors
        }

        if request.custom_template:
            # Save custom template to temporary file
            with tempfile.NamedTemporaryFile(
                mode='w',
                delete=False,
                suffix='.template',
                encoding='utf-8'
            ) as tmp_template:
                tmp_template.write(request.custom_template)
                template_path = tmp_template.name

            # Create temporary output file
            with tempfile.NamedTemporaryFile(
                mode='w',
                delete=False,
                suffix='.out'
            ) as tmp_output:
                output_path = tmp_output.name

            # Export with custom template
            flattened_colors: Dict[str, Any] = pywal_export.flatten_colors(  # type: ignore[attr-defined]
                full_colors
            )
            pywal_export.template(  # type: ignore[attr-defined]
                flattened_colors,
                template_path,
                output_path
            )

            # Read result
            with open(output_path, 'r', encoding='utf-8') as f:
                result: str = f.read()

        else:
            # Use predefined pywal template
            with tempfile.NamedTemporaryFile(
                mode='w',
                delete=False,
                suffix='.out'
            ) as tmp_output:
                output_path = tmp_output.name

            pywal_export.color(  # type: ignore[attr-defined]
                full_colors,
                request.template_type,
                output_path
            )

            # Read result
            with open(output_path, 'r', encoding='utf-8') as f:
                result = f.read()

        logger.info(
            "Template exported successfully: type=%s, size=%d bytes",
            request.template_type,
            len(result)
        )

        return ExportResponse(
            content=result,
            template_type=request.template_type
        )

    except Exception as e:
        logger.exception("Error exporting template")
        raise HTTPException(
            status_code=500,
            detail=f"Export failed: {str(e)}"
        ) from e
    finally:
        # Cleanup temporary files
        if template_path and os.path.exists(template_path):
            os.remove(template_path)
            logger.info("Temporary template deleted: %s", template_path)
        if output_path and os.path.exists(output_path):
            os.remove(output_path)
            logger.info("Temporary output deleted: %s", output_path)


if __name__ == "__main__":
    import uvicorn
    import sys

    port = int(sys.argv[1])

    uvicorn.run(
        app,
        host="127.0.0.1",
        port=port,
        log_level="info"
    )

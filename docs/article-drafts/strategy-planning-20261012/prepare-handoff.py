"""Compatibility entry point for the current four-article notebook workflow."""
from pathlib import Path
import runpy
import sys
folder=Path(__file__).resolve().parent / "pitches"
sys.path.insert(0,str(folder))
runpy.run_path(str(folder / "prepare_notebooks.py"),run_name="__main__")

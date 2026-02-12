from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from src.database import get_db
from . import service, schemas
# from src.modules.auth.dependencies import get_current_user # Assuming auth exists

router = APIRouter(
    prefix="/builder",
    tags=["Website Builder"]
)

# Mock user dependency for now if auth is not fully exposed to me
def get_current_user():
    return 1 # Mock user ID

@router.get("/sites", response_model=List[schemas.SiteResponse])
def read_sites(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    user_id = get_current_user()
    sites = service.get_sites(db, user_id=user_id)
    return sites

@router.post("/sites", response_model=schemas.SiteResponse)
def create_site(site: schemas.SiteCreate, db: Session = Depends(get_db)):
    user_id = get_current_user()
    return service.create_site(db=db, site=site, user_id=user_id)

@router.get("/sites/{site_id}", response_model=schemas.SiteResponse)
def read_site(site_id: int, db: Session = Depends(get_db)):
    db_site = service.get_site(db, site_id=site_id)
    if db_site is None:
        raise HTTPException(status_code=404, detail="Site not found")
    return db_site

@router.put("/sites/{site_id}", response_model=schemas.SiteResponse)
def update_site(site_id: int, site: schemas.SiteUpdate, db: Session = Depends(get_db)):
    db_site = service.update_site(db, site_id=site_id, site=site)
    if db_site is None:
        raise HTTPException(status_code=404, detail="Site not found")
    return db_site

@router.delete("/sites/{site_id}", response_model=schemas.SiteResponse)
def delete_site(site_id: int, db: Session = Depends(get_db)):
    db_site = service.delete_site(db, site_id=site_id)
    if db_site is None:
        raise HTTPException(status_code=404, detail="Site not found")
    return db_site

@router.post("/sites/{site_id}/pages", response_model=schemas.PageResponse)
def create_page(site_id: int, page: schemas.PageCreate, db: Session = Depends(get_db)):
    return service.create_page(db=db, page=page, site_id=site_id)

@router.get("/pages/{page_id}", response_model=schemas.PageResponse)
def read_page(page_id: int, db: Session = Depends(get_db)):
    db_page = service.get_page(db, page_id=page_id)
    if db_page is None:
        raise HTTPException(status_code=404, detail="Page not found")
    return db_page

@router.put("/pages/{page_id}", response_model=schemas.PageResponse)
def update_page(page_id: int, page: schemas.PageUpdate, db: Session = Depends(get_db)):
    db_page = service.update_page(db, page_id=page_id, page=page)
    if db_page is None:
        raise HTTPException(status_code=404, detail="Page not found")
    return db_page

@router.delete("/pages/{page_id}", response_model=schemas.PageResponse)
def delete_page(page_id: int, db: Session = Depends(get_db)):
    db_page = service.delete_page(db, page_id=page_id)
    if db_page is None:
        raise HTTPException(status_code=404, detail="Page not found")
    return db_page

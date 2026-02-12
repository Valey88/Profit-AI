from sqlalchemy.orm import Session
from . import models, schemas

def get_sites(db: Session, user_id: int):
    return db.query(models.Site).filter(models.Site.user_id == user_id).all()

def get_site(db: Session, site_id: int):
    return db.query(models.Site).filter(models.Site.id == site_id).first()

def create_site(db: Session, site: schemas.SiteCreate, user_id: int):
    db_site = models.Site(**site.model_dump(), user_id=user_id)
    db.add(db_site)
    db.commit()
    db.refresh(db_site)
    # Create default home page
    create_page(db, schemas.PageCreate(name="Home", slug="home", content=[]), site_id=db_site.id)
    return db_site

def update_site(db: Session, site_id: int, site: schemas.SiteUpdate):
    db_site = get_site(db, site_id)
    if not db_site:
        return None
    for key, value in site.model_dump(exclude_unset=True).items():
        setattr(db_site, key, value)
    db.commit()
    db.refresh(db_site)
    return db_site

def delete_site(db: Session, site_id: int):
    db_site = get_site(db, site_id)
    if db_site:
        db.delete(db_site)
        db.commit()
    return db_site

def get_pages(db: Session, site_id: int):
    return db.query(models.Page).filter(models.Page.site_id == site_id).all()

def get_page(db: Session, page_id: int):
    return db.query(models.Page).filter(models.Page.id == page_id).first()

def create_page(db: Session, page: schemas.PageCreate, site_id: int):
    db_page = models.Page(**page.model_dump(), site_id=site_id)
    db.add(db_page)
    db.commit()
    db.refresh(db_page)
    return db_page

def update_page(db: Session, page_id: int, page: schemas.PageUpdate):
    db_page = get_page(db, page_id)
    if not db_page:
        return None
    for key, value in page.model_dump(exclude_unset=True).items():
        setattr(db_page, key, value)
    db.commit()
    db.refresh(db_page)
    return db_page

def delete_page(db: Session, page_id: int):
    db_page = get_page(db, page_id)
    if db_page:
        db.delete(db_page)
        db.commit()
    return db_page

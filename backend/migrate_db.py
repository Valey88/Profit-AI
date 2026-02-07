import sqlite3

def migrate():
    conn = sqlite3.connect('data.db')
    cursor = conn.cursor()
    
    try:
        cursor.execute("ALTER TABLE knowledge_files ADD COLUMN content TEXT")
        conn.commit()
        print("Successfully added 'content' column to knowledge_files table.")
    except sqlite3.OperationalError as e:
        print(f"Migration failed (maybe column already exists): {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    migrate()

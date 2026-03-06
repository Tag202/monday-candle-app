CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE fragrances (

    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    
     -- Stable URL identifier (created once, never auto-updated)
    slug TEXT NOT NULL UNIQUE
        CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    
    -- User-facing name (can be changed freely)
    display_name TEXT NOT NULL
        CHECK (length(trim(display_name)) > 0),
    
    description TEXT,
    
    category VARCHAR(100),
    
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    
    is_active BOOLEAN GENERATED ALWAYS AS (stock_quantity > 0) STORED,
    
    image_url TEXT,
    
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

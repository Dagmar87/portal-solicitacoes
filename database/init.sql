CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS requests (
    id SERIAL PRIMARY KEY,

    title VARCHAR(150) NOT NULL,

    description TEXT NOT NULL,

    category VARCHAR(30) NOT NULL,

    status VARCHAR(30) NOT NULL DEFAULT 'ABERTO',

    user_id INTEGER NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_requests_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_category
        CHECK (
            category IN (
                'TI',
                'RH',
                'COMPRAS',
                'FINANCEIRO',
                'INFRAESTRUTURA'
            )
        ),

    CONSTRAINT chk_status
        CHECK (
            status IN (
                'ABERTO',
                'EM_ATENDIMENTO',
                'CONCLUIDO'
            )
        )
);

CREATE INDEX IF NOT EXISTS idx_requests_status
    ON requests(status);

CREATE INDEX IF NOT EXISTS idx_requests_category
    ON requests(category);

CREATE INDEX IF NOT EXISTS idx_requests_created_at
    ON requests(created_at);

CREATE INDEX IF NOT EXISTS idx_requests_user_id
    ON requests(user_id);
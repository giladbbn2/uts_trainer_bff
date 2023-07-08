-- Table: public.active_sessions

-- DROP TABLE IF EXISTS public.active_sessions;

CREATE TABLE IF NOT EXISTS public.active_sessions
(
    session_id character(32) COLLATE pg_catalog."default" NOT NULL,
    user_id character(32) COLLATE pg_catalog."default" NOT NULL,
    valid_until timestamp without time zone,
    CONSTRAINT active_sessions_pkey PRIMARY KEY (session_id),
    CONSTRAINT user_id_unique UNIQUE (user_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.active_sessions
    OWNER to postgres;


-- Table: public.users

-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    user_id character(32) COLLATE pg_catalog."default" NOT NULL,
    first_name character varying(250) COLLATE pg_catalog."default" NOT NULL,
    last_name character varying(250) COLLATE pg_catalog."default" NOT NULL,
    is_manager boolean NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (user_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;

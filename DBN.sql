--
-- PostgreSQL database dump
--

\restrict czEHjql2IZhFyx6dYMu4PblNLrgOfUJm7nVj5EVBNHH9A9nfHjgLKkuyzDo2JDT

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

-- Started on 2026-07-25 21:32:21

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 860 (class 1247 OID 50434)
-- Name: estado_civil_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_civil_enum AS ENUM (
    'Soltero',
    'Casado',
    'Union Libre',
    'Viudo',
    'Divorciado'
);


ALTER TYPE public.estado_civil_enum OWNER TO postgres;

--
-- TOC entry 863 (class 1247 OID 50446)
-- Name: estado_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_enum AS ENUM (
    'Activo',
    'Inactivo'
);


ALTER TYPE public.estado_enum OWNER TO postgres;

--
-- TOC entry 866 (class 1247 OID 50452)
-- Name: estado_sync_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_sync_enum AS ENUM (
    'Pendiente',
    'Sincronizado',
    'Error'
);


ALTER TYPE public.estado_sync_enum OWNER TO postgres;

--
-- TOC entry 857 (class 1247 OID 50426)
-- Name: genero_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.genero_enum AS ENUM (
    'Masculino',
    'Femenino',
    'Otro'
);


ALTER TYPE public.genero_enum OWNER TO postgres;

--
-- TOC entry 869 (class 1247 OID 50460)
-- Name: tipo_archivo_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipo_archivo_enum AS ENUM (
    'TXT',
    'PDF'
);


ALTER TYPE public.tipo_archivo_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 232 (class 1259 OID 50586)
-- Name: Usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Usuario" (
    id integer NOT NULL,
    usuario character varying NOT NULL,
    contrasena character varying NOT NULL,
    nombre character varying NOT NULL,
    apellido character varying NOT NULL,
    correo character varying NOT NULL,
    estado character varying DEFAULT 'Activo'::character varying NOT NULL
);


ALTER TABLE public."Usuario" OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 50585)
-- Name: Usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Usuario_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Usuario_id_seq" OWNER TO postgres;

--
-- TOC entry 5017 (class 0 OID 0)
-- Dependencies: 231
-- Name: Usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Usuario_id_seq" OWNED BY public."Usuario".id;


--
-- TOC entry 218 (class 1259 OID 50472)
-- Name: eps; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.eps (
    id_eps integer NOT NULL,
    nombre character varying(100) NOT NULL
);


ALTER TABLE public.eps OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 50471)
-- Name: eps_id_eps_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.eps ALTER COLUMN id_eps ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.eps_id_eps_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 228 (class 1259 OID 50560)
-- Name: historial_cambios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historial_cambios (
    id integer NOT NULL,
    numero_documento character varying(50) NOT NULL,
    id_usuario integer,
    campo_modificado character varying(100) NOT NULL,
    valor_anterior text,
    valor_nuevo text,
    fecha timestamp without time zone DEFAULT now() NOT NULL,
    id_sincronizacion integer
);


ALTER TABLE public.historial_cambios OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 50559)
-- Name: historial_cambios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.historial_cambios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historial_cambios_id_seq OWNER TO postgres;

--
-- TOC entry 5018 (class 0 OID 0)
-- Dependencies: 227
-- Name: historial_cambios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historial_cambios_id_seq OWNED BY public.historial_cambios.id;


--
-- TOC entry 230 (class 1259 OID 50570)
-- Name: historial_sincronizacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historial_sincronizacion (
    id integer NOT NULL,
    id_usuario integer,
    nombre_usuario character varying(200),
    fecha_inicio timestamp without time zone DEFAULT now() NOT NULL,
    fecha_fin timestamp without time zone,
    duracion_ms integer,
    cantidad_registros integer DEFAULT 0 NOT NULL,
    registros_nuevos integer DEFAULT 0 NOT NULL,
    registros_actualizados integer DEFAULT 0 NOT NULL,
    registros_sin_cambios integer DEFAULT 0 NOT NULL,
    registros_error integer DEFAULT 0 NOT NULL,
    estado character varying(30) DEFAULT 'COMPLETADO'::character varying NOT NULL,
    tipo_archivo_generado character varying(30),
    observaciones text
);


ALTER TABLE public.historial_sincronizacion OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 50569)
-- Name: historial_sincronizacion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.historial_sincronizacion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historial_sincronizacion_id_seq OWNER TO postgres;

--
-- TOC entry 5019 (class 0 OID 0)
-- Dependencies: 229
-- Name: historial_sincronizacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historial_sincronizacion_id_seq OWNED BY public.historial_sincronizacion.id;


--
-- TOC entry 225 (class 1259 OID 50524)
-- Name: historialcambios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historialcambios (
    id_historial integer NOT NULL,
    id_sync integer NOT NULL,
    numero_documento character varying(20) NOT NULL,
    nombre_campo character varying(100) NOT NULL,
    valor_anterior text,
    valor_nuevo text,
    fecha_cambio timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.historialcambios OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 50523)
-- Name: historialcambios_id_historial_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.historialcambios ALTER COLUMN id_historial ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.historialcambios_id_historial_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 223 (class 1259 OID 50510)
-- Name: historialsincronizacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historialsincronizacion (
    id_sync integer NOT NULL,
    id_usuario integer NOT NULL,
    fecha_inicio timestamp without time zone NOT NULL,
    fecha_fin timestamp without time zone,
    estado public.estado_sync_enum,
    cantidad_cambios integer DEFAULT 0,
    archivo_generado character varying(255),
    tipo_archivo public.tipo_archivo_enum,
    observacion text
);


ALTER TABLE public.historialsincronizacion OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 50509)
-- Name: historialsincronizacion_id_sync_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.historialsincronizacion ALTER COLUMN id_sync ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.historialsincronizacion_id_sync_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 221 (class 1259 OID 50488)
-- Name: persona; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.persona (
    numero_documento character varying(20) NOT NULL,
    id_tipo_documento integer NOT NULL,
    nombres character varying(100) NOT NULL,
    apellidos character varying(100) NOT NULL,
    fecha_nacimiento date,
    genero public.genero_enum,
    estado_civil public.estado_civil_enum,
    direccion character varying(200),
    barrio character varying(100),
    estrato smallint,
    telefono1 character varying(20),
    telefono2 character varying(20),
    telefono3 character varying(20),
    correo character varying(100),
    id_eps integer,
    estado public.estado_enum DEFAULT 'Activo'::public.estado_enum,
    estado_sincronizacion public.estado_sync_enum DEFAULT 'Pendiente'::public.estado_sync_enum,
    fecha_creacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    fecha_ultima_sincronizacion timestamp without time zone
);


ALTER TABLE public.persona OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 50548)
-- Name: personas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.personas (
    numero_documento character varying(50) NOT NULL,
    id_tipo_documento integer,
    nombres character varying(200) NOT NULL,
    apellidos character varying(200) NOT NULL,
    fecha_nacimiento date,
    genero character varying(20),
    id_eps integer,
    direccion character varying(300),
    barrio character varying(100),
    estrato character varying(5),
    correo character varying(200),
    estado_civil character varying(30),
    telefono1 character varying(20),
    telefono2 character varying(20),
    telefono3 character varying(20),
    estado character varying(30) DEFAULT 'Activo'::character varying NOT NULL,
    estado_sincronizacion character varying(30) DEFAULT 'PENDING_INSERT'::character varying NOT NULL,
    fecha_actualizacion timestamp without time zone DEFAULT now() NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    eps_otro_nombre character varying(200)
);


ALTER TABLE public.personas OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 50466)
-- Name: tipodocumento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipodocumento (
    id_tipo_documento integer NOT NULL,
    nombre character varying(50) NOT NULL
);


ALTER TABLE public.tipodocumento OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 50465)
-- Name: tipodocumento_id_tipo_documento_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.tipodocumento ALTER COLUMN id_tipo_documento ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tipodocumento_id_tipo_documento_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 220 (class 1259 OID 50478)
-- Name: usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario (
    id_usuario integer NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido character varying(100) NOT NULL,
    correo character varying(100),
    usuario character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    estado public.estado_enum DEFAULT 'Activo'::public.estado_enum
);


ALTER TABLE public.usuario OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 50477)
-- Name: usuario_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.usuario ALTER COLUMN id_usuario ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.usuario_id_usuario_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 4814 (class 2604 OID 50589)
-- Name: Usuario id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuario" ALTER COLUMN id SET DEFAULT nextval('public."Usuario_id_seq"'::regclass);


--
-- TOC entry 4804 (class 2604 OID 50563)
-- Name: historial_cambios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_cambios ALTER COLUMN id SET DEFAULT nextval('public.historial_cambios_id_seq'::regclass);


--
-- TOC entry 4806 (class 2604 OID 50573)
-- Name: historial_sincronizacion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_sincronizacion ALTER COLUMN id SET DEFAULT nextval('public.historial_sincronizacion_id_seq'::regclass);


--
-- TOC entry 5011 (class 0 OID 50586)
-- Dependencies: 232
-- Data for Name: Usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Usuario" (id, usuario, contrasena, nombre, apellido, correo, estado) FROM stdin;
1	encuestador1	$2b$10$WVQGEm8VDXpOqvZqQNyQked7zZL7XdUp0sQPUOVUB7UXPSWkAIzTq	Juan	Pérez	juan.perez@salud.gov.co	Activo
\.


--
-- TOC entry 4997 (class 0 OID 50472)
-- Dependencies: 218
-- Data for Name: eps; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.eps (id_eps, nombre) FROM stdin;
\.


--
-- TOC entry 5007 (class 0 OID 50560)
-- Dependencies: 228
-- Data for Name: historial_cambios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historial_cambios (id, numero_documento, id_usuario, campo_modificado, valor_anterior, valor_nuevo, fecha, id_sincronizacion) FROM stdin;
\.


--
-- TOC entry 5009 (class 0 OID 50570)
-- Dependencies: 230
-- Data for Name: historial_sincronizacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historial_sincronizacion (id, id_usuario, nombre_usuario, fecha_inicio, fecha_fin, duracion_ms, cantidad_registros, registros_nuevos, registros_actualizados, registros_sin_cambios, registros_error, estado, tipo_archivo_generado, observaciones) FROM stdin;
\.


--
-- TOC entry 5004 (class 0 OID 50524)
-- Dependencies: 225
-- Data for Name: historialcambios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historialcambios (id_historial, id_sync, numero_documento, nombre_campo, valor_anterior, valor_nuevo, fecha_cambio) FROM stdin;
\.


--
-- TOC entry 5002 (class 0 OID 50510)
-- Dependencies: 223
-- Data for Name: historialsincronizacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historialsincronizacion (id_sync, id_usuario, fecha_inicio, fecha_fin, estado, cantidad_cambios, archivo_generado, tipo_archivo, observacion) FROM stdin;
\.


--
-- TOC entry 5000 (class 0 OID 50488)
-- Dependencies: 221
-- Data for Name: persona; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.persona (numero_documento, id_tipo_documento, nombres, apellidos, fecha_nacimiento, genero, estado_civil, direccion, barrio, estrato, telefono1, telefono2, telefono3, correo, id_eps, estado, estado_sincronizacion, fecha_creacion, fecha_actualizacion, fecha_ultima_sincronizacion) FROM stdin;
\.


--
-- TOC entry 5005 (class 0 OID 50548)
-- Dependencies: 226
-- Data for Name: personas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.personas (numero_documento, id_tipo_documento, nombres, apellidos, fecha_nacimiento, genero, id_eps, direccion, barrio, estrato, correo, estado_civil, telefono1, telefono2, telefono3, estado, estado_sincronizacion, fecha_actualizacion, fecha_creacion, eps_otro_nombre) FROM stdin;
\.


--
-- TOC entry 4995 (class 0 OID 50466)
-- Dependencies: 216
-- Data for Name: tipodocumento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipodocumento (id_tipo_documento, nombre) FROM stdin;
\.


--
-- TOC entry 4999 (class 0 OID 50478)
-- Dependencies: 220
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario (id_usuario, nombre, apellido, correo, usuario, password, estado) FROM stdin;
1	Juan	Pérez	juan.perez@salud.gov.co	encuestador1	$2b$10$8xuFoz11F5MTZ.Iq1QDO0.YhvXH/uks00hUFk9qScvvd.R3aP2iY2	Activo
\.


--
-- TOC entry 5020 (class 0 OID 0)
-- Dependencies: 231
-- Name: Usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Usuario_id_seq"', 1, true);


--
-- TOC entry 5021 (class 0 OID 0)
-- Dependencies: 217
-- Name: eps_id_eps_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.eps_id_eps_seq', 1, false);


--
-- TOC entry 5022 (class 0 OID 0)
-- Dependencies: 227
-- Name: historial_cambios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historial_cambios_id_seq', 1, false);


--
-- TOC entry 5023 (class 0 OID 0)
-- Dependencies: 229
-- Name: historial_sincronizacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historial_sincronizacion_id_seq', 1, false);


--
-- TOC entry 5024 (class 0 OID 0)
-- Dependencies: 224
-- Name: historialcambios_id_historial_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historialcambios_id_historial_seq', 1, false);


--
-- TOC entry 5025 (class 0 OID 0)
-- Dependencies: 222
-- Name: historialsincronizacion_id_sync_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historialsincronizacion_id_sync_seq', 1, false);


--
-- TOC entry 5026 (class 0 OID 0)
-- Dependencies: 215
-- Name: tipodocumento_id_tipo_documento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tipodocumento_id_tipo_documento_seq', 1, false);


--
-- TOC entry 5027 (class 0 OID 0)
-- Dependencies: 219
-- Name: usuario_id_usuario_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_id_usuario_seq', 1, true);


--
-- TOC entry 4841 (class 2606 OID 50584)
-- Name: historial_sincronizacion PK_78fe4fc1422d5ec7a51d147584d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_sincronizacion
    ADD CONSTRAINT "PK_78fe4fc1422d5ec7a51d147584d" PRIMARY KEY (id);


--
-- TOC entry 4837 (class 2606 OID 50558)
-- Name: personas PK_8636062e926a684e8e3a58d50af; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personas
    ADD CONSTRAINT "PK_8636062e926a684e8e3a58d50af" PRIMARY KEY (numero_documento);


--
-- TOC entry 4843 (class 2606 OID 50594)
-- Name: Usuario PK_925c3fc5494373e254405c000eb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuario"
    ADD CONSTRAINT "PK_925c3fc5494373e254405c000eb" PRIMARY KEY (id);


--
-- TOC entry 4839 (class 2606 OID 50568)
-- Name: historial_cambios PK_d013e787240859f57c3351ed07c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_cambios
    ADD CONSTRAINT "PK_d013e787240859f57c3351ed07c" PRIMARY KEY (id);


--
-- TOC entry 4845 (class 2606 OID 50596)
-- Name: Usuario UQ_d71225e4bdaa65249c3e1c88cf3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuario"
    ADD CONSTRAINT "UQ_d71225e4bdaa65249c3e1c88cf3" UNIQUE (usuario);


--
-- TOC entry 4819 (class 2606 OID 50476)
-- Name: eps eps_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eps
    ADD CONSTRAINT eps_pkey PRIMARY KEY (id_eps);


--
-- TOC entry 4833 (class 2606 OID 50531)
-- Name: historialcambios historialcambios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historialcambios
    ADD CONSTRAINT historialcambios_pkey PRIMARY KEY (id_historial);


--
-- TOC entry 4829 (class 2606 OID 50517)
-- Name: historialsincronizacion historialsincronizacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historialsincronizacion
    ADD CONSTRAINT historialsincronizacion_pkey PRIMARY KEY (id_sync);


--
-- TOC entry 4827 (class 2606 OID 50498)
-- Name: persona persona_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT persona_pkey PRIMARY KEY (numero_documento);


--
-- TOC entry 4817 (class 2606 OID 50470)
-- Name: tipodocumento tipodocumento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipodocumento
    ADD CONSTRAINT tipodocumento_pkey PRIMARY KEY (id_tipo_documento);


--
-- TOC entry 4821 (class 2606 OID 50485)
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario);


--
-- TOC entry 4823 (class 2606 OID 50487)
-- Name: usuario usuario_usuario_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_usuario_key UNIQUE (usuario);


--
-- TOC entry 4834 (class 1259 OID 50544)
-- Name: idx_historial_documento; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_historial_documento ON public.historialcambios USING btree (numero_documento);


--
-- TOC entry 4835 (class 1259 OID 50545)
-- Name: idx_historial_sync; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_historial_sync ON public.historialcambios USING btree (id_sync);


--
-- TOC entry 4824 (class 1259 OID 50542)
-- Name: idx_persona_documento; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_persona_documento ON public.persona USING btree (numero_documento);


--
-- TOC entry 4825 (class 1259 OID 50543)
-- Name: idx_persona_estado_sync; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_persona_estado_sync ON public.persona USING btree (estado_sincronizacion);


--
-- TOC entry 4830 (class 1259 OID 50547)
-- Name: idx_sync_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sync_fecha ON public.historialsincronizacion USING btree (fecha_inicio);


--
-- TOC entry 4831 (class 1259 OID 50546)
-- Name: idx_sync_usuario; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sync_usuario ON public.historialsincronizacion USING btree (id_usuario);


--
-- TOC entry 4849 (class 2606 OID 50537)
-- Name: historialcambios fk_historial_persona; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historialcambios
    ADD CONSTRAINT fk_historial_persona FOREIGN KEY (numero_documento) REFERENCES public.persona(numero_documento);


--
-- TOC entry 4850 (class 2606 OID 50532)
-- Name: historialcambios fk_historial_sync; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historialcambios
    ADD CONSTRAINT fk_historial_sync FOREIGN KEY (id_sync) REFERENCES public.historialsincronizacion(id_sync);


--
-- TOC entry 4846 (class 2606 OID 50504)
-- Name: persona fk_persona_eps; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT fk_persona_eps FOREIGN KEY (id_eps) REFERENCES public.eps(id_eps);


--
-- TOC entry 4847 (class 2606 OID 50499)
-- Name: persona fk_persona_tipo_documento; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.persona
    ADD CONSTRAINT fk_persona_tipo_documento FOREIGN KEY (id_tipo_documento) REFERENCES public.tipodocumento(id_tipo_documento);


--
-- TOC entry 4848 (class 2606 OID 50518)
-- Name: historialsincronizacion fk_sync_usuario; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historialsincronizacion
    ADD CONSTRAINT fk_sync_usuario FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario);


-- Completed on 2026-07-25 21:32:22

--
-- PostgreSQL database dump complete
--

\unrestrict czEHjql2IZhFyx6dYMu4PblNLrgOfUJm7nVj5EVBNHH9A9nfHjgLKkuyzDo2JDT


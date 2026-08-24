--
-- PostgreSQL database dump
--

\restrict GMhbq7iQskZ2a9W78kj1W0bz1kMbfQnaQZc3rSHdUeScakEAmPIysCJT5qSMYG2

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

-- Started on 2026-08-20 14:24:19

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
-- TOC entry 855 (class 1247 OID 50434)
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
-- TOC entry 858 (class 1247 OID 50446)
-- Name: estado_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_enum AS ENUM (
    'Activo',
    'Inactivo'
);


ALTER TYPE public.estado_enum OWNER TO postgres;

--
-- TOC entry 861 (class 1247 OID 50452)
-- Name: estado_sync_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_sync_enum AS ENUM (
    'Pendiente',
    'Sincronizado',
    'Error'
);


ALTER TYPE public.estado_sync_enum OWNER TO postgres;

--
-- TOC entry 852 (class 1247 OID 50426)
-- Name: genero_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.genero_enum AS ENUM (
    'Masculino',
    'Femenino',
    'Otro'
);


ALTER TYPE public.genero_enum OWNER TO postgres;

--
-- TOC entry 864 (class 1247 OID 50460)
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
-- TOC entry 225 (class 1259 OID 50586)
-- Name: Usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Usuario" (
    id integer NOT NULL,
    usuario character varying NOT NULL,
    contrasena character varying NOT NULL,
    nombre character varying NOT NULL,
    apellido character varying NOT NULL,
    correo character varying NOT NULL,
    estado character varying DEFAULT 'Activo'::character varying NOT NULL,
    rol character varying(30) DEFAULT 'ENCUESTADOR'::character varying
);


ALTER TABLE public."Usuario" OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 50585)
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
-- TOC entry 4978 (class 0 OID 0)
-- Dependencies: 224
-- Name: Usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Usuario_id_seq" OWNED BY public."Usuario".id;


--
-- TOC entry 227 (class 1259 OID 50600)
-- Name: conflicto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.conflicto (
    id integer NOT NULL,
    persona_documento character varying(50) NOT NULL,
    campo character varying(100) NOT NULL,
    valor_actual text,
    valor_recibido text,
    valor_resuelto text,
    usuario_id integer,
    fecha_creacion timestamp without time zone DEFAULT now(),
    origen character varying(20) NOT NULL,
    estado character varying(30) DEFAULT 'PENDIENTE'::character varying,
    resuelto_por integer,
    fecha_resolucion timestamp without time zone,
    decision character varying(30),
    motivo text,
    id_sincronizacion integer,
    version_actual_servidor integer,
    version_base_recibida integer
);


ALTER TABLE public.conflicto OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 50599)
-- Name: conflicto_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.conflicto_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.conflicto_id_seq OWNER TO postgres;

--
-- TOC entry 4979 (class 0 OID 0)
-- Dependencies: 226
-- Name: conflicto_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.conflicto_id_seq OWNED BY public.conflicto.id;


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
-- TOC entry 221 (class 1259 OID 50560)
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
-- TOC entry 220 (class 1259 OID 50559)
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
-- TOC entry 4980 (class 0 OID 0)
-- Dependencies: 220
-- Name: historial_cambios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historial_cambios_id_seq OWNED BY public.historial_cambios.id;


--
-- TOC entry 223 (class 1259 OID 50570)
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
    observaciones text,
    registros_conflictos integer DEFAULT 0
);


ALTER TABLE public.historial_sincronizacion OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 50569)
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
-- TOC entry 4981 (class 0 OID 0)
-- Dependencies: 222
-- Name: historial_sincronizacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historial_sincronizacion_id_seq OWNED BY public.historial_sincronizacion.id;


--
-- TOC entry 219 (class 1259 OID 50548)
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
    eps_otro_nombre character varying(200),
    ultimo_editor_id integer,
    version_persona integer DEFAULT 1 NOT NULL
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
-- TOC entry 4795 (class 2604 OID 50589)
-- Name: Usuario id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuario" ALTER COLUMN id SET DEFAULT nextval('public."Usuario_id_seq"'::regclass);


--
-- TOC entry 4798 (class 2604 OID 50603)
-- Name: conflicto id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conflicto ALTER COLUMN id SET DEFAULT nextval('public.conflicto_id_seq'::regclass);


--
-- TOC entry 4784 (class 2604 OID 50563)
-- Name: historial_cambios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_cambios ALTER COLUMN id SET DEFAULT nextval('public.historial_cambios_id_seq'::regclass);


--
-- TOC entry 4786 (class 2604 OID 50573)
-- Name: historial_sincronizacion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_sincronizacion ALTER COLUMN id SET DEFAULT nextval('public.historial_sincronizacion_id_seq'::regclass);


--
-- TOC entry 4970 (class 0 OID 50586)
-- Dependencies: 225
-- Data for Name: Usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Usuario" (id, usuario, contrasena, nombre, apellido, correo, estado, rol) FROM stdin;
1	encuestador1	$2b$10$WVQGEm8VDXpOqvZqQNyQked7zZL7XdUp0sQPUOVUB7UXPSWkAIzTq	Juan	Pérez	juan.perez@salud.gov.co	Activo	ENCUESTADOR
2	admin1	$2b$10$Utfc0tOKktZpvOMUZ/XfUOYgti38fF12ekFptAQSSAUi7KABQyg2G	Admin	Principal	admin@salud.gov.co	Activo	ADMIN
\.


--
-- TOC entry 4972 (class 0 OID 50600)
-- Dependencies: 227
-- Data for Name: conflicto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.conflicto (id, persona_documento, campo, valor_actual, valor_recibido, valor_resuelto, usuario_id, fecha_creacion, origen, estado, resuelto_por, fecha_resolucion, decision, motivo, id_sincronizacion, version_actual_servidor, version_base_recibida) FROM stdin;
2	1115792345	id_eps	5	3	3	1	2026-08-11 15:54:53.058768	OFFLINE	RESUELTO	2	2026-08-11 21:53:12.34	ACEPTAR_NUEVO	La persona cambio su eps	\N	\N	\N
1	1115792345	id_eps	5	3	5	1	2026-08-11 15:54:52.769746	OFFLINE	RESUELTO	2	2026-08-11 21:53:28.786	MANTENER_ACTUAL	Jdjfi	\N	\N	\N
\.


--
-- TOC entry 4963 (class 0 OID 50472)
-- Dependencies: 218
-- Data for Name: eps; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.eps (id_eps, nombre) FROM stdin;
\.


--
-- TOC entry 4966 (class 0 OID 50560)
-- Dependencies: 221
-- Data for Name: historial_cambios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historial_cambios (id, numero_documento, id_usuario, campo_modificado, valor_anterior, valor_nuevo, fecha, id_sincronizacion) FROM stdin;
5	1747089	1	REGISTRO_NUEVO	\N	Creado desde sincronización	2026-08-07 16:26:43.351469	6
6	111577880	1	REGISTRO_NUEVO	\N	Creado desde sincronización	2026-08-07 16:26:43.38618	6
7	1001234567	1	REGISTRO_NUEVO	\N	Creado desde sincronización	2026-08-07 16:26:43.393591	6
8	100234567	1	REGISTRO_NUEVO	\N	Creado desde sincronización	2026-08-07 16:26:43.401464	6
9	1003456789	1	REGISTRO_NUEVO	\N	Creado desde sincronización	2026-08-07 16:26:43.409519	6
10	1115792345	1	REGISTRO_NUEVO	\N	Creado desde sincronización	2026-08-07 16:26:43.416705	6
11	1116793423	1	REGISTRO_NUEVO	\N	Creado desde sincronización	2026-08-07 16:26:43.424684	6
12	1118256142	1	REGISTRO_NUEVO	\N	Creado desde sincronización	2026-08-07 16:26:43.432538	6
4	40078628	1	REGISTRO_NUEVO	\N	Creado desde sincronización	2026-08-07 15:49:17.132355	5
3	1117512328	1	direccion	\N	Calle 19 A 9	2026-08-07 15:47:20.722086	4
2	1117512328	1	REGISTRO_NUEVO	\N	Creado desde sincronización	2026-08-07 15:46:35.363636	3
1	1115722435	1	REGISTRO_NUEVO	\N	Creado desde sincronización	2026-07-27 22:02:27.062811	1
13	745321444	1	REGISTRO_NUEVO	\N	Creado desde sincronización	2026-08-11 15:51:32.053577	7
14	1115792345	2	id_eps	5	3	2026-08-11 21:53:12.260299	\N
15	1115792345	2	id_eps (RESOLUCION CONFLICTO)	5	5 (MANTENIDO)	2026-08-11 21:53:28.781013	\N
16	1747089	1	id_eps	3	5	2026-08-12 15:31:56.072401	10
17	1747089	1	barrio	\N	El jardín	2026-08-16 16:08:13.017774	14
\.


--
-- TOC entry 4968 (class 0 OID 50570)
-- Dependencies: 223
-- Data for Name: historial_sincronizacion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historial_sincronizacion (id, id_usuario, nombre_usuario, fecha_inicio, fecha_fin, duracion_ms, cantidad_registros, registros_nuevos, registros_actualizados, registros_sin_cambios, registros_error, estado, tipo_archivo_generado, observaciones, registros_conflictos) FROM stdin;
1	1	\N	2026-07-27 22:02:27.409015	2026-07-27 22:02:27.404	2203	1	1	0	0	0	COMPLETADO	\N	[]	0
2	1	\N	2026-07-27 22:02:27.992754	2026-07-27 22:02:27.99	33	1	0	0	1	0	COMPLETADO	\N	[]	0
3	1	\N	2026-08-07 15:46:35.40829	2026-08-07 15:46:35.407	45	1	1	0	0	0	COMPLETADO	\N	[]	0
4	1	\N	2026-08-07 15:47:20.749758	2026-08-07 15:47:20.75	76	1	0	1	0	0	COMPLETADO	\N	[]	0
5	1	\N	2026-08-07 15:49:17.150157	2026-08-07 15:49:17.149	67	1	1	0	0	0	COMPLETADO	\N	[]	0
6	1	\N	2026-08-07 16:26:43.439852	2026-08-07 16:26:43.439	138	8	8	0	0	0	COMPLETADO	\N	[]	0
7	1	\N	2026-08-11 15:51:32.031406	2026-08-11 15:51:32.061	40	1	1	0	0	0	COMPLETADO	\N	[]	0
8	1	\N	2026-08-11 15:54:52.747308	2026-08-11 15:54:52.787	102	1	0	0	0	0	COMPLETADO	\N	[]	0
9	1	\N	2026-08-11 15:54:53.053662	2026-08-11 15:54:53.063	12	1	0	0	0	0	COMPLETADO	\N	[]	0
10	1	encuestador1	2026-08-12 15:31:56.05574	2026-08-12 15:31:56.088	35	1	0	1	0	0	COMPLETADO	\N	{"errores":[],"conflictos":[]}	0
11	1	encuestador1	2026-08-16 15:51:45.744037	2026-08-16 15:51:45.787	88	1	0	0	0	1	ERROR	\N	{"errores":["no existe la columna PersonaEntity.version_persona"],"conflictos":[]}	0
12	1	encuestador1	2026-08-16 15:52:11.033687	2026-08-16 15:52:11.045	64	1	0	0	0	1	ERROR	\N	{"errores":["no existe la columna PersonaEntity.version_persona"],"conflictos":[]}	0
13	1	encuestador1	2026-08-16 15:52:12.74539	2026-08-16 15:52:12.755	11	1	0	0	0	1	ERROR	\N	{"errores":["no existe la columna PersonaEntity.version_persona"],"conflictos":[]}	0
14	1	encuestador1	2026-08-16 16:08:12.990669	2026-08-16 16:08:13.047	120	1	0	1	0	0	COMPLETADO	\N	{"errores":[],"conflictos":[]}	0
\.


--
-- TOC entry 4964 (class 0 OID 50548)
-- Dependencies: 219
-- Data for Name: personas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.personas (numero_documento, id_tipo_documento, nombres, apellidos, fecha_nacimiento, genero, id_eps, direccion, barrio, estrato, correo, estado_civil, telefono1, telefono2, telefono3, estado, estado_sincronizacion, fecha_actualizacion, fecha_creacion, eps_otro_nombre, ultimo_editor_id, version_persona) FROM stdin;
1001234567	1	Josefina	Guaca	1975-07-28	F	1	\N	\N	2	josefina@gmail.com	Divorciado	3001234567	\N	\N	Activo	SYNCED	2026-08-07 16:19:59.221	2026-08-07 16:26:43.393591	\N	1	1
100234567	1	Manuel	Torres	1986-08-07	M	1	\N	\N	1	manuel@gmail.com	Soltero	3012345678	\N	\N	Activo	SYNCED	2026-08-07 16:21:01.751	2026-08-07 16:26:43.401464	\N	1	1
1003456789	1	Deicy	Barrera	2003-08-07	F	1	\N	\N	1	deicy@gmail.com	\N	3034567890	\N	\N	Activo	SYNCED	2026-08-07 16:22:01.004	2026-08-07 16:26:43.409519	\N	1	1
1115722435	5	Cristian	Calderón	2008-04-11	M	3	\N	\N	1	cristian@gmail.com	Soltero	3104567892	\N	\N	Activo	SYNCED	2026-07-27 13:50:20.24	2026-07-27 22:02:27.062811	\N	1	1
111577880	1	Pedro	Gamez	1992-07-24	M	4	\N	\N	3	pedro@gmail.com	UnionLibre	3157084310	\N	\N	Activo	SYNCED	2026-08-07 16:18:24.148	2026-08-07 16:26:43.38618	\N	1	1
1115792345	1	Monica	Tenorio	2007-08-01	F	3	\N	\N	1	monica@gmail.com	Soltero	3134502360	\N	\N	Activo	SYNCED	2026-08-11 21:53:12.260299	2026-08-07 16:26:43.416705	\N	2	1
1116793423	5	Dagoberto	Suarez	2024-08-07	M	4	\N	\N	1	\N	Soltero	3204502137	\N	\N	Activo	SYNCED	2026-08-07 16:25:28.533	2026-08-07 16:26:43.424684	\N	1	1
1117512328	1	Yuleiny	Lugo Quimbayo	2008-04-08	F	99	Calle 19 A 9	Los ángeles	1	yuleinylugo71@gmail.com	UnionLibre	3228451079	\N	\N	Activo	SYNCED	2026-08-07 15:47:20.722086	2026-08-07 15:46:35.363636	Asmet salud	1	1
1118256142	5	Marcos	Díaz	2023-07-10	M	1	\N	\N	2	\N	Soltero	\N	\N	\N	Activo	SYNCED	2026-08-07 16:26:24.192	2026-08-07 16:26:43.432538	\N	1	1
40078628	1	María cristiana	Tenorio Poscue	1979-10-09	F	99	\N	El jardín	1	cristinatenorio@gmail.com	Casado	3208034279	\N	\N	Activo	SYNCED	2026-08-07 15:49:14.203	2026-08-07 15:49:17.132355	Asmet salud	1	1
745321444	1	Prueba Sincronizacion	Permanente	1995-10-10	F	1	\N	\N	\N	permanente@test.com	\N	3209876543	\N	\N	Activo	SYNCED	2026-08-11 15:51:32.053577	2026-08-11 15:51:32.053577	\N	1	1
1747089	1	José Yuber	Gasca	1984-09-02	M	5	\N	El jardín	1	gascajoseyuber@gmail.com	Casado	3202020450	\N	\N	Activo	SYNCED	2026-08-16 16:08:13.017774	2026-08-07 16:26:43.351469	\N	1	2
\.


--
-- TOC entry 4961 (class 0 OID 50466)
-- Dependencies: 216
-- Data for Name: tipodocumento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tipodocumento (id_tipo_documento, nombre) FROM stdin;
\.


--
-- TOC entry 4982 (class 0 OID 0)
-- Dependencies: 224
-- Name: Usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Usuario_id_seq"', 2, true);


--
-- TOC entry 4983 (class 0 OID 0)
-- Dependencies: 226
-- Name: conflicto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.conflicto_id_seq', 2, true);


--
-- TOC entry 4984 (class 0 OID 0)
-- Dependencies: 217
-- Name: eps_id_eps_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.eps_id_eps_seq', 1, false);


--
-- TOC entry 4985 (class 0 OID 0)
-- Dependencies: 220
-- Name: historial_cambios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historial_cambios_id_seq', 17, true);


--
-- TOC entry 4986 (class 0 OID 0)
-- Dependencies: 222
-- Name: historial_sincronizacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historial_sincronizacion_id_seq', 14, true);


--
-- TOC entry 4987 (class 0 OID 0)
-- Dependencies: 215
-- Name: tipodocumento_id_tipo_documento_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tipodocumento_id_tipo_documento_seq', 1, false);


--
-- TOC entry 4810 (class 2606 OID 50584)
-- Name: historial_sincronizacion PK_78fe4fc1422d5ec7a51d147584d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_sincronizacion
    ADD CONSTRAINT "PK_78fe4fc1422d5ec7a51d147584d" PRIMARY KEY (id);


--
-- TOC entry 4806 (class 2606 OID 50558)
-- Name: personas PK_8636062e926a684e8e3a58d50af; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personas
    ADD CONSTRAINT "PK_8636062e926a684e8e3a58d50af" PRIMARY KEY (numero_documento);


--
-- TOC entry 4812 (class 2606 OID 50594)
-- Name: Usuario PK_925c3fc5494373e254405c000eb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuario"
    ADD CONSTRAINT "PK_925c3fc5494373e254405c000eb" PRIMARY KEY (id);


--
-- TOC entry 4808 (class 2606 OID 50568)
-- Name: historial_cambios PK_d013e787240859f57c3351ed07c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_cambios
    ADD CONSTRAINT "PK_d013e787240859f57c3351ed07c" PRIMARY KEY (id);


--
-- TOC entry 4814 (class 2606 OID 50596)
-- Name: Usuario UQ_d71225e4bdaa65249c3e1c88cf3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Usuario"
    ADD CONSTRAINT "UQ_d71225e4bdaa65249c3e1c88cf3" UNIQUE (usuario);


--
-- TOC entry 4816 (class 2606 OID 50609)
-- Name: conflicto conflicto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conflicto
    ADD CONSTRAINT conflicto_pkey PRIMARY KEY (id);


--
-- TOC entry 4804 (class 2606 OID 50476)
-- Name: eps eps_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eps
    ADD CONSTRAINT eps_pkey PRIMARY KEY (id_eps);


--
-- TOC entry 4802 (class 2606 OID 50470)
-- Name: tipodocumento tipodocumento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipodocumento
    ADD CONSTRAINT tipodocumento_pkey PRIMARY KEY (id_tipo_documento);


-- Completed on 2026-08-20 14:24:19

--
-- PostgreSQL database dump complete
--

\unrestrict GMhbq7iQskZ2a9W78kj1W0bz1kMbfQnaQZc3rSHdUeScakEAmPIysCJT5qSMYG2


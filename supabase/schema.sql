-- Servisni nalozi
create table orders (
  id           uuid primary key default gen_random_uuid(),
  code         text unique not null,   
  client_name  text not null,
  client_phone text,
  title        text not null,
  description  text,
  status       text not null default 'zaprimljeno',
  assigned_to  text,                   
  created_at   timestamptz not null default now(),
  started_at   timestamptz,           
  completed_at timestamptz            
);

-- Napomene uz nalog
create table notes (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references orders(id) on delete cascade,
  body       text not null,
  author     text,
  created_at timestamptz not null default now()
);

-- Fotografije uz nalog 
create table photos (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references orders(id) on delete cascade,
  url        text not null,
  created_at timestamptz not null default now()
);

-- Korisnici aplikacije: serviseri i administrator
create table app_users (
  id            uuid primary key default gen_random_uuid(),
  username      text unique not null,
  password_hash text not null,         
  full_name     text,
  role          text not null default 'serviser',  
  created_at    timestamptz not null default now()
);
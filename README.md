# ServiceTracker

ServiceTracker je web aplikacija za praćenje servisnih poslova i radnih naloga. Korisnicima (serviserima i administratoru) omogućuje unos novih poslova, uređivanje njihovih podataka, dodavanje napomena i fotografija te postavljanje statusa poput Zaprimljeno, U tijeku ili Završeno. Aplikacija uključuje pregled svih aktivnih i završenih poslova, filtriranje po statusu ili klijentu te osnovnu analitiku (broj poslova i trajanje po mjesecu). Opcionalno, klijenti mogu putem šifre naloga provjeriti stanje svog servisa. Cilj aplikacije je olakšati organizaciju, praćenje i evidenciju servisnih intervencija.

## Struktura

- `backend/` - Node.js / Express REST API
- `frontend/` - Vue.js aplikacija
- `supabase/` - SQL shema baze
- `nginx/` - konfiguracija load balancera

## Tehnologije

- Frontend: Vue.js
- Backend: Node.js / Express
- Baza: Supabase (PostgreSQL)
- Docker + Nginx (vise instanci backenda iza load balancera)

## Pokretanje

1. **Baza:** u Supabaseu pokreni `supabase/schema.sql` (SQL Editor) i napravi public bucket `photos` (Storage).

2. **.env** (u korijenu i u `backend/`):

   SUPABASE_URL=https://tvoj-projekt.supabase.co
   SUPABASE_SECRET=tvoj_secret_kljuc
   JWT_SECRET=neki_tajni_niz

3. **Početni korisnici:**

   cd backend
   npm install
   node seed.js

4. **Pokreni sustav** (iz korijena):

   docker compose up --build

5. Otvori `frontend/index.html` u pregledniku.

## Računi

| Korisnik | Lozinka     | Uloga    |
| -------- | ----------- | -------- |
| admin    | admin123    | admin    |
| serviser | serviser123 | serviser |

## Napomena

Backend je stateless, pa Nginx round-robin metodom dijeli zahtjeve među tri instance. Svaki odgovor nosi zaglavlje X-Instance (vidljivo u sučelju) koje pokazuje koja je instanca obradila zahtjev.

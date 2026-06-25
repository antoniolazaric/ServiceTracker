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

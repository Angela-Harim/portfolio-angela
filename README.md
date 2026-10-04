# Portfolio — Angela Harimalala

Portfolio personnel d'Angela Harimalala, développeuse front-end en recherche d'alternance.

## Technologies

React · TypeScript · TanStack Start · Tailwind CSS

## Lancer le projet en local

```sh
npm install
npm run dev
```

## Contact

hei.angela.5@gmail.com

## Configuration Netlify

Le preset Nitro `netlify` génère les fichiers publics dans `dist`, le répertoire publié par Netlify. Le rendu côté serveur est déployé séparément via les fonctions générées dans `.netlify/functions-internal`.

Configurer les variables dans Netlify, sans enregistrer leurs valeurs dans le dépôt. Le fichier `.env.example` indique les noms nécessaires ; les fichiers `.env` et `.env.*` sont ignorés, sauf cet exemple.

`VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_KEY` sont intégrées au navigateur à la compilation. Utiliser uniquement une clé Supabase publique (`sb_publishable_` ou une ancienne clé `anon`), jamais une clé secrète ou `service_role`. Les variables `SUPABASE_URL` et `SUPABASE_PUBLISHABLE_KEY` correspondent à la configuration côté serveur.

Le contrôle des secrets reste actif. `SECRETS_SCAN_OMIT_KEYS` dans `netlify.toml` exclut seulement ces quatre variables Supabase publiques et `CONTACT_NOTIFY_EMAIL`, dont l'adresse est déjà publiée dans le portfolio. Les valeurs identiques des variables côté serveur et côté navigateur nécessitent d'exclure les deux noms.

`RESEND_API_KEY` doit rester disponible uniquement côté serveur et n'est pas exclue du contrôle. Toute éventuelle clé `SUPABASE_SERVICE_ROLE_KEY` reste également contrôlée. Ne jamais donner un préfixe `VITE_` à une clé privée. Si une clé privée a été publiée, la révoquer et la remplacer avant de redéployer.

Si un déploiement signale encore un secret, vérifier les noms et chemins indiqués dans le journal détaillé, plutôt que désactiver le contrôle globalement.

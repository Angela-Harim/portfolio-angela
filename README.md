# Portfolio — Angela Harimalala

Portfolio personnel d'Angela Harimalala, développeuse front-end en recherche d'alternance.

## Technologies

React · TypeScript · TanStack Start · Tailwind CSS

## Lancer le projet en local

```sh
npm install
npm run dev
```

## Déploiement sur Netlify

Utilisez `.env.example` comme modèle pour votre configuration locale. Les fichiers
`.env` et `.env.*` sont ignorés, à l'exception de ce modèle sans clés.

Configurez les variables dans Netlify plutôt que d'ajouter leurs valeurs au dépôt :

- `VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_KEY` sont publiques et disponibles
  pendant le build. Utilisez uniquement une clé Supabase publishable ou une ancienne
  clé `anon`, jamais une clé secrète ou `service_role`.
- `SUPABASE_URL` et `SUPABASE_PUBLISHABLE_KEY` contiennent les mêmes valeurs publiques
  pour les fonctions serveur et doivent être disponibles à l'exécution.
- `RESEND_API_KEY` et `CONTACT_NOTIFY_EMAIL` sont utilisées uniquement dans la fonction
  serveur de contact et doivent être disponibles à l'exécution. Ne préfixez jamais
  une clé privée avec `VITE_`.

La configuration Netlify exclut uniquement les quatre variables Supabase publiques
du scan de secrets, y compris leurs noms non préfixés qui partagent les mêmes valeurs.
Le scan reste actif pour `RESEND_API_KEY`, les clés `service_role` et les autres secrets.
Si un prochain déploiement signale une clé privée, consultez les chemins indiqués dans
le log complet et retirez la valeur exposée plutôt que d'élargir les exclusions.

## Contact

hei.angela.5@gmail.com

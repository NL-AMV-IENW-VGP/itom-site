// ITOM Auth — Supabase magic-link login
// Configureer hieronder jouw Supabase project credentials.
// Deze waarden zijn veilig voor client-side gebruik (anon key is by design publiek).
//
// Aanmaken via: https://supabase.com
// Project URL en anon key vind je in: Project Settings → API

const SUPABASE_URL = 'https://ojjdstkuuhwgvusqomsm.supabase.co';
const SUPABASE_KEY = 'sb_publishable_bZn3MVoZh4qGrxgr_tM9JQ_GXjfh6Ij';

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function initAuth() {
  const { data: { session } } = await sb.auth.getSession();
  if (session) {
    showContent();
    return;
  }

  showLoginOverlay();

  sb.auth.onAuthStateChange((_event, session) => {
    if (session) showContent();
  });
}

function showContent() {
  document.getElementById('auth-overlay').style.display = 'none';
  document.getElementById('main-content').style.display = '';
}

function showLoginOverlay() {
  document.getElementById('main-content').style.display = 'none';
  document.getElementById('auth-overlay').style.display = 'flex';
}

async function sendMagicLink() {
  const emailInput = document.getElementById('auth-email');
  const btn        = document.getElementById('auth-btn');
  const msg        = document.getElementById('auth-msg');
  const email      = emailInput.value.trim().toLowerCase();

  if (!email.endsWith('@atos.net')) {
    msg.textContent = 'Alleen @atos.net e-mailadressen zijn toegestaan.';
    msg.className = 'auth-msg auth-error';
    return;
  }

  btn.disabled = true;
  msg.textContent = 'Bezig met versturen…';
  msg.className = 'auth-msg';

  const { error } = await sb.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true }
  });

  if (error) {
    msg.textContent = 'Fout: ' + error.message;
    msg.className = 'auth-msg auth-error';
    btn.disabled = false;
  } else {
    msg.textContent = 'Controleer je inbox — klik de link in de e-mail om in te loggen.';
    msg.className = 'auth-msg auth-success';
  }
}

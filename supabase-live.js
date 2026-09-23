/* Live Supabase connection. This file intentionally uses only the browser-safe
   publishable key; privileged/service credentials are never shipped to users. */
(function () {
  const projectUrl = 'https://ciyomlxwcaznamjfqzhm.supabase.co';
  const publishableKey = 'sb_publishable_L2wjfusY4yuE2V7lUZfnbw_vhEeb8nt';
  if (!window.supabase) {
    console.warn('ScopeAI: Supabase client could not load.');
    return;
  }

  const client = window.supabase.createClient(projectUrl, publishableKey);
  window.scopeSupabase = client;

  const notify = (message) => typeof window.toast === 'function' ? window.toast(message) : alert(message);
  const authMode = () => (location.hash || '').replace('#/', '');

  document.addEventListener('click', async (event) => {
    const button = event.target.closest('.auth .btn');
    if (!button || !['login', 'signup', 'forgot-password'].includes(authMode())) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    const email = document.getElementById('authmail')?.value.trim();
    const password = document.getElementById('authpass')?.value;
    const fullName = document.getElementById('authname')?.value.trim();
    if (!email || (authMode() !== 'forgot-password' && !password)) {
      notify('Please enter your email and password.');
      return;
    }

    button.disabled = true;
    const originalText = button.textContent;
    button.textContent = authMode() === 'signup' ? 'Creating account…' : 'Signing in…';
    try {
      if (authMode() === 'forgot-password') {
        const { error } = await client.auth.resetPasswordForEmail(email);
        if (error) throw error;
        notify('Password reset link sent. Please check your inbox.');
        return;
      }
      const result = authMode() === 'signup'
        ? await client.auth.signUp({ email, password, options: { data: { full_name: fullName || '' } } })
        : await client.auth.signInWithPassword({ email, password });
      if (result.error) throw result.error;
      if (!result.data.session) {
        notify('Account created. Check your email to confirm it, then sign in.');
        return;
      }
      notify(authMode() === 'signup' ? 'Account created. Welcome to ScopeAI!' : 'Welcome back to ScopeAI!');
      location.hash = '#/dashboard';
    } catch (error) {
      notify(error.message || 'Unable to complete that request. Please try again.');
    } finally {
      button.disabled = false;
      button.textContent = originalText;
    }
  }, true);

  document.addEventListener('submit', async (event) => {
    const form = event.target.closest('form[data-scopeai-analysis]');
    if (!form) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const data = new FormData(form);
    const projectTitle = String(data.get('project_title') || '').trim();
    const description = String(data.get('description') || '').trim();
    if (!projectTitle || !description) {
      notify('Please add a project name and description.');
      return;
    }

    const { data: authData, error: authError } = await client.auth.getUser();
    if (authError || !authData.user) {
      notify('Please sign in before saving a live project brief.');
      location.hash = '#/login';
      return;
    }
    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    const originalText = submit.textContent;
    submit.textContent = 'Saving brief…';
    try {
      const { error } = await client.from('project_briefs').insert({
        user_id: authData.user.id,
        project_title: projectTitle,
        project_type: String(data.get('project_type') || ''),
        description,
        budget: String(data.get('budget') || ''),
        status: 'draft',
        ai_analysis: { company: String(data.get('company') || '').trim(), source: 'ScopeAI workspace' }
      });
      if (error) throw error;
      state.company = String(data.get('company') || '').trim();
      localStorage.setItem('scopeai-state', JSON.stringify(state));
      notify('Project brief saved securely to your ScopeAI account.');
      location.hash = '#/brief/demo';
    } catch (error) {
      notify(error.message || 'Your brief could not be saved. Please try again.');
    } finally {
      submit.disabled = false;
      submit.textContent = originalText;
    }
  }, true);
})();

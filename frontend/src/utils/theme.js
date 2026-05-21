export const initTheme = () => {
  const theme = localStorage.getItem('theme');
  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
  }
};

export const toggleTheme = () => {
  if (document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    return 'light';
  } else {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    return 'dark';
  }
};

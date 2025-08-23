function scalePage() {
  const wrapper = document.getElementById('page-wrapper');
  const maxWidth = 600;   // largura de cada container
  const maxHeight = 1600; // altura aproximada dos dois containers juntos
  const availableWidth = window.innerWidth - 40; // 20px margem esquerda + direita
  const scale = Math.min(
    availableWidth / maxWidth,
    window.innerHeight / maxHeight
  );
  wrapper.style.transform = `scale(${scale})`;
  wrapper.style.transformOrigin = 'top center';
}

window.addEventListener('resize', scalePage);
window.addEventListener('load', scalePage);

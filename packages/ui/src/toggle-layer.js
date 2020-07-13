(function () {
  function inject() {
    const head = document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.innerHTML = `
body.show-layers [data-test] {
  outline: black dashed 1px;
  outline-offset: 1px;
  position: relative;
  overflow: visible;
}

body.show-layers [data-test]:after {
  content: attr(data-test);
  position: absolute;
  top: 0;
  left: 100%;
  margin-left: 3px;
  font-size: 10px;
  color: black;
  font-style: italic;
  white-space: nowrap;
}

body.show-layers button[data-test] {
  font-size: 0;
}

body.show-layers button[data-test]:after {
  position: static;
  color: inherit;
  font-size: 16px;
}

.toggle-layers-btn {
  position: absolute;
  z-index: 1000000;
  left: 5px;
  top: 5px;
  display: inline-block;
  font-weight: 400;
  border: 1px solid transparent;
  padding: 3px 6px;
  font-size: 12px;
  line-height: 1.5;
  border-radius: 4px;
  background: #e83e8c;
  color: white;
}

.toggle-layers-btn:hover {
  opacity: 0.8;
  cursor: pointer;
}

body.show-layers [data-test][data-test-dir='left']:after {
  left: auto;
  right: 100%;
  margin-left: 0px;
  margin-right: 3px;
  }

body.show-layers [data-test][data-test-dir='top']:after {
  left: 0;
  top: -15px;
}

body.show-layers [data-test][data-test-dir='top-center']:after {
  left: 50%;
  transform: translate(-50%, 0);
  top: -15px;
}

`;
    head.appendChild(style);
    const btn = document.createElement('button');
    btn.className = 'toggle-layers-btn';
    btn.addEventListener('click', () => {
      document.body.classList.toggle('show-layers');
    });
    btn.textContent = 'Toggle layers';
    document.body.appendChild(btn);
  }
  function checkIsInjected() {
    setInterval(() => {
      if (!document.querySelector('.toggle-layers-btn')) {
        inject();
      }
    }, 50);
  }
  function init() {
    inject();
    checkIsInjected();
  }
  if (document.body) {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();

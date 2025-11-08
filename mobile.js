document.addEventListener('DOMContentLoaded', function(){

    const commSection = document.getElementById('commissions-section');
    const contactSection = document.getElementById('contact-section');
    const showCommBtn = document.getElementById('show-commissions');
    const showContactBtn = document.getElementById('show-contact');
    const backBtns = document.querySelectorAll('.mobile-back');

    function hideAll(){
        [commSection, contactSection].forEach(s => s?.classList.add('section-hidden'));
    }

    showCommBtn?.addEventListener('click', e => {
        e.preventDefault();
        hideAll();
        commSection?.classList.remove('section-hidden');
        animateButtons(commSection, '.commission-btn');
    });

    showContactBtn?.addEventListener('click', e => {
        e.preventDefault();
        hideAll();
        contactSection?.classList.remove('section-hidden');
        animateButtons(contactSection, '.contact-btn');
    });

    backBtns.forEach(btn => btn.addEventListener('click', () => hideAll()));

    // Copy Discord
    const copyDiscordBtn = document.getElementById('copy-discord');
    copyDiscordBtn?.addEventListener('click', () => {
        const text = copyDiscordBtn.dataset.discord || '';
        navigator.clipboard?.writeText(text).then(() => {
            copyDiscordBtn.textContent = 'Copied ✓';
            setTimeout(()=> copyDiscordBtn.textContent = 'Copy Discord', 1800);
        });
    });

    // Overlay for commission details
    const overlay = document.getElementById('mobile-overlay');
    const overlayTitle = document.getElementById('overlay-title');
    const overlayDesc = document.getElementById('overlay-desc');
    const overlayPrice = document.getElementById('overlay-price');
    const overlayClose = document.getElementById('overlay-close');

    function showOverlay(title, desc, price){
        overlayTitle.textContent = title;
        overlayDesc.textContent = desc;
        overlayPrice.textContent = price;
        overlay.classList.add('show');
        overlay.setAttribute('aria-hidden','false');
    }

    function hideOverlay(){
        overlay.classList.remove('show');
        overlay.setAttribute('aria-hidden','true');
    }

    overlayClose?.addEventListener('click', hideOverlay);
    overlay?.addEventListener('click', e => { if(e.target===overlay) hideOverlay(); });

    document.querySelectorAll('.commission-btn').forEach(btn=>{
        btn.addEventListener('click', ()=>{
            showOverlay(btn.dataset.title, btn.dataset.desc, btn.dataset.price);
        });
    });

    function animateButtons(section, selector){
        const nodes = section.querySelectorAll(selector);
        nodes.forEach((n,i) => {
            n.classList.remove('slide-btn');
            setTimeout(()=> n.classList.add('slide-btn'), i*100);
            setTimeout(()=> n.classList.remove('slide-btn'), i*100 + 500);
        });
    }

});

(function($){
  $(function(){
    try{
      var agent = navigator.userAgent || '';
      var isWebkit = (agent.indexOf('AppleWebKit') > 0);
      var isIPad = (agent.indexOf('iPad') > 0);
      var isIOS = (agent.indexOf('iPhone') > 0 || agent.indexOf('iPod') > 0);
      var isAndroid = (agent.indexOf('Android') > 0);
      var isNewBlackBerry = (agent.indexOf('AppleWebKit') > 0 && agent.indexOf('BlackBerry') > 0);
      var isWebOS = (agent.indexOf('webOS') > 0);
      var isWindowsMobile = (agent.indexOf('IEMobile') > 0);
      var isSmallScreen = (screen.width < 767 || (isAndroid && screen.width < 1000));
      var isUnknownMobile = (isWebkit && isSmallScreen);
      var isMobile = (isIOS || isAndroid || isNewBlackBerry || isWebOS || isWindowsMobile || isUnknownMobile);
      var isTablet = (isIPad || (isMobile && !isSmallScreen));

      function hasMobileCookieOrSkip(){
        // check cookie mobileFullSiteClicked
        if(document.cookie && document.cookie.indexOf('mobileFullSiteClicked=') > -1) return true;
        try{ if(localStorage && localStorage.getItem('skipMobile') === 'true') return true; }catch(e){}
        return false;
      }

      if(isMobile && isSmallScreen && !hasMobileCookieOrSkip()){
        var path = window.location.pathname || '';
        if(!/mobile_index\.html$/.test(path)){
          window.location.replace('mobile_index.html');
        }
      }
    }catch(e){ /* silent */ }
  });
})(window.jQuery || window.$);

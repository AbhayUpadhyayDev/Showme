(function () {

    /* =========================
       DYNAMIC CSS INJECTION
       ========================= */
    const style = document.createElement('style');
    style.textContent = `
#toast-container {
    position: fixed;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 400px;
    font-family: Arial, sans-serif;
    pointer-events: none;
    transition: all 0.3s ease;
}
#toast-container.top-right { top: 20px; right: 20px; align-items: flex-end; }
#toast-container.top-left { top: 20px; left: 20px; align-items: flex-start; }
#toast-container.bottom-right { bottom: 20px; right: 20px; align-items: flex-end; }
#toast-container.bottom-left { bottom: 20px; left: 20px; align-items: flex-start; }

.toast {
    display: flex;
    flex-direction: column;
    background: #333;
    color: #fff;
    padding: 14px 18px;
    border-radius: 6px;
    box-shadow: 0 6px 18px rgba(0,0,0,0.3);
    opacity: 0;
    transform: translateX(120%);
    transition: transform 0.4s cubic-bezier(0.25,1.2,0.5,1), opacity 0.3s ease, margin 0.3s ease;
    pointer-events: auto;
    position: relative;
    overflow: hidden;
    min-width: 250px;
    font-family: Arial, sans-serif;
}
.toast.show { opacity:1; transform:translateX(0); }

.toast.success { background:#4caf50; color:#fff; }
.toast.info { background:#2196f3; color:#fff; }
.toast.warning { background:#ff9800; color:#fff; }
.toast.error { background:#f44336; color:#fff; }

.toast-message { margin-bottom: 6px; word-break: break-word; }
.toast-action {
    background: rgba(255,255,255,0.2);
    border: none;
    color: #fff;
    padding: 5px 10px;
    border-radius: 6px;
    cursor: pointer;
    margin-top:5px;
    font-weight:bold;
    font-size:0.9em;
}
.toast-close { position:absolute; top:6px; right:10px; cursor:pointer; font-weight:bold; font-size:1.1em; }
.toast-progress {
    position:absolute;
    bottom:0;
    left:0;
    height:4px;
    background: rgba(255,255,255,0.7);
    width:100%;
    transform-origin:left;
    animation-timing-function: linear;
}
@keyframes progress { from{transform:scaleX(1);} to{transform:scaleX(0);} }
@keyframes spin {0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

@media (prefers-reduced-motion: reduce) {
    .toast { transition: none !important; animation: none !important; }
}`;
    document.head.appendChild(style);

    /* =========================
       TOAST CONTAINER
       ========================= */
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'top-right';
        container.setAttribute('role', 'region');
        container.setAttribute('aria-live', 'polite');
        document.body.appendChild(container);
    }

    const activeToasts = [];
    const DEFAULTS = { maxToasts: 5, duration: 4000, position: 'top-right', animation: true };

    /* =========================
       TOAST FUNCTION
       ========================= */
    function showmeToast(options = {}) {
        const opts = { ...DEFAULTS, ...options };
        container.className = opts.position;
        const t = document.createElement('div');
        t.className = 'toast ' + (opts.type || '');
        t.style.borderRadius = (opts.radius || 6) + 'px';
        if (opts.bgColor) t.style.background = opts.bgColor;
        if (opts.textColor) t.style.color = opts.textColor;
        t.setAttribute('role', (opts.type==='error'||opts.type==='warning')?'alert':'status');

        const msgDiv = document.createElement('div');
        msgDiv.className = 'toast-message';
        if (opts.customHTML) msgDiv.appendChild(opts.customHTML);
        else msgDiv.textContent = opts.message || '';
        t.appendChild(msgDiv);

        (opts.actions||[]).forEach(act=>{
            const btn=document.createElement('button');
            btn.className='toast-action';
            btn.textContent=act.text||'Action';
            btn.onclick=e=>{e.stopPropagation(); act.callback && act.callback(); removeToast(t);};
            t.appendChild(btn);
        });

        const close = document.createElement('span');
        close.className='toast-close'; close.innerHTML='&times;';
        close.onclick=e=>{e.stopPropagation(); removeToast(t);}
        t.appendChild(close);

        let timeout;
        if(!opts.persistent){
            const progress = document.createElement('div');
            progress.className='toast-progress';
            progress.style.animation=`progress ${opts.duration}ms linear forwards`;
            t.appendChild(progress);
            timeout = setTimeout(()=>removeToast(t), opts.duration);

            let start=Date.now(), remaining=opts.duration;
            const pauseToast=()=>{clearTimeout(timeout); remaining -= Date.now()-start; progress.style.animationPlayState='paused';};
            const resumeToast=()=>{start=Date.now(); timeout=setTimeout(()=>removeToast(t), remaining); progress.style.animation=`progress ${remaining}ms linear forwards`; progress.style.animationPlayState='running';};
            t.addEventListener('mouseenter', pauseToast);
            t.addEventListener('mouseleave', resumeToast);
        }

        if(opts.onClick) t.addEventListener('click',()=>opts.onClick(t));

        container.appendChild(t);
        activeToasts.push(t);
        if(activeToasts.length>opts.maxToasts) removeToast(activeToasts[0]);
        if(opts.animation) requestAnimationFrame(()=>t.classList.add('show')); else t.classList.add('show');
        if(opts.onShow) opts.onShow(t);

        let start=Date.now(), remaining=opts.duration;
        t.addEventListener('mouseenter',()=>{if(timeout){clearTimeout(timeout); remaining-=(Date.now()-start);}});
        t.addEventListener('mouseleave',()=>{if(timeout){start=Date.now(); timeout=setTimeout(()=>removeToast(t),remaining);}});

        let startX=0;
        t.addEventListener('touchstart',e=>startX=e.touches[0].clientX);
        t.addEventListener('touchend',e=>{if(e.changedTouches[0].clientX-startX>50) removeToast(t);});

        function removeToast(toastElem){
            if(!toastElem) return;
            toastElem.classList.remove('show');
            toastElem.addEventListener('transitionend',()=>{
                toastElem.remove();
                const index=activeToasts.indexOf(toastElem);
                if(index>-1) activeToasts.splice(index,1);
                if(opts.onClose) opts.onClose(toastElem);
            },{once:true});
        }

        return { element:t, update:(newOpts={})=>{if(newOpts.message) msgDiv.textContent=newOpts.message;if(newOpts.bgColor) t.style.background=newOpts.bgColor;if(newOpts.textColor) t.style.color=newOpts.textColor;}, close:()=>removeToast(t), on:(event,callback)=>t.addEventListener(event,callback) };
    }

    /* =========================
       EXPORT TOAST
       ========================= */
    window.showme = function(options){ return showmeToast(options); };
    window.showme.config = function(conf){ Object.assign(DEFAULTS,conf); };

    /* =========================
       OTP DIALOG
       ========================= */
    window.showme.otp = function({
        length=6, message="Enter OTP", onComplete=null, bgColor="#fff",otpTextColor="#fff",
        textColor="#333", blockSize=50, blockBorderRadius=8, cardBorderRadius=12,
        gap=10, overlayBg="rgba(0,0,0,0.5)", inputType="number", autoCloseDelay=500
    }={}){
        const overlay=document.createElement('div');
        overlay.style.cssText=`position:fixed; top:0; left:0; width:100vw; height:100vh; background:${overlayBg};
            display:flex; justify-content:center; align-items:center; z-index:99999;`;
        const container=document.createElement('div');
        container.style.cssText=`background:${bgColor}; color:${textColor}; padding:25px 30px;
            border-radius:${cardBorderRadius}px; display:flex; flex-direction:column; align-items:center;
            gap:20px; max-width:90%; min-width:300px; box-shadow:0 10px 30px rgba(0,0,0,0.25);`;

        const title=document.createElement('div'); title.textContent=message;
        title.style.cssText="font-size:1.4em; font-weight:600; text-align:center;";
        container.appendChild(title);

        const inputContainer=document.createElement('div'); inputContainer.style.display='flex'; inputContainer.style.gap=gap+'px';
        const inputs=[];
        for(let i=0;i<length;i++){
            const inp=document.createElement('input');
            inp.type='text'; inp.maxLength=1;
            inp.style.cssText=`width:${blockSize}px; height:${blockSize}px; text-align:center; font-size:1.5em; border-radius:${blockBorderRadius}px;
                border:1px solid #ccc; outline:none; background:#f9f9f9; color:${otpTextColor}; caret-color:${otpTextColor}; transition:all 0.2s;`;
            inp.addEventListener('focus',()=>{ inp.style.boxShadow=`0 0 0 2px #2196f3`; inp.style.borderColor='#2196f3';});
            inp.addEventListener('blur',()=>{ inp.style.boxShadow='none'; inp.style.borderColor='#ccc';});
            inp.addEventListener('input',()=>{
                if(inputType==='number') inp.value=inp.value.replace(/[^0-9]/g,'');
                else if(inputType==='alphanumeric') inp.value=inp.value.replace(/[^0-9a-zA-Z]/g,'');
                if(inp.value.length>0 && i<length-1) inputs[i+1].focus();
                checkComplete();
            });
            inp.addEventListener('keydown',e=>{ if(e.key==='Backspace' && inp.value==='' && i>0) inputs[i-1].focus(); });
            inputs.push(inp); inputContainer.appendChild(inp);
        }
        container.appendChild(inputContainer); overlay.appendChild(container); document.body.appendChild(overlay);
        inputs[0].focus();

        function checkComplete(){
            const otp=inputs.map(i=>i.value).join('');
            if(otp.length===length){ if(onComplete) onComplete(otp); setTimeout(()=>overlay.remove(),autoCloseDelay); }
        }
        overlay.addEventListener('click',e=>{ if(e.target===overlay) overlay.remove(); });
    };

    /* =========================
       CONFIRM DIALOG
       ========================= */
    window.showme.confirm = function({
        message="Are you sure?", type="info", onConfirm=null, onCancel=null, bgColor="#fff",
        textColor="#333", cardRadius=12, overlayBg="rgba(0,0,0,0.5)", confirmText="Yes", cancelText="No", icon=null
    }={}){
        const overlay=document.createElement('div');
        overlay.style.cssText=`position:fixed; top:0; left:0; width:100vw; height:100vh; background:${overlayBg};
            display:flex; justify-content:center; align-items:center; z-index:99999;`;
        const card=document.createElement('div');
        card.style.cssText=`background:${bgColor}; color:${textColor}; padding:25px 30px; border-radius:${cardRadius}px;
            display:flex; flex-direction:column; align-items:center; gap:20px; max-width:90%; min-width:300px; box-shadow:0 10px 30px rgba(0,0,0,0.25); text-align:center;`;
        if(icon){ const iconEl=document.createElement('div'); iconEl.innerHTML=icon; iconEl.style.fontSize='2em'; card.appendChild(iconEl);}
        const msg=document.createElement('div'); msg.textContent=message; msg.style.cssText='font-size:1.2em; font-weight:500;';
        card.appendChild(msg);
        const btnContainer=document.createElement('div'); btnContainer.style.cssText='display:flex; gap:15px;';
        const btnYes=document.createElement('button'); btnYes.textContent=confirmText;
        btnYes.style.cssText='padding:8px 18px; background:#4caf50; color:#fff; border:none; border-radius:4px; cursor:pointer;';
        btnYes.onclick=()=>{ onConfirm && onConfirm(); overlay.remove();};
        const btnNo=document.createElement('button'); btnNo.textContent=cancelText;
        btnNo.style.cssText='padding:8px 18px; background:#f44336; color:#fff; border:none; border-radius:4px; cursor:pointer;';
        btnNo.onclick=()=>{ onCancel && onCancel(); overlay.remove();};
        btnContainer.appendChild(btnYes); btnContainer.appendChild(btnNo); card.appendChild(btnContainer);
        overlay.appendChild(card); document.body.appendChild(overlay);
        overlay.addEventListener('click',e=>{ if(e.target===overlay) overlay.remove(); });
    };


    /* =========================
       LOADING / SPINNER
       ========================= */
    window.showme.loading = function({
        message="Loading...", bgColor="#fff", textColor="#333", cardRadius=12, overlayBg="rgba(0,0,0,0.5)"
    }={}){
        const overlay=document.createElement('div');
        overlay.style.cssText=`position:fixed; top:0; left:0; width:100vw; height:100vh; background:${overlayBg};
            display:flex; justify-content:center; align-items:center; z-index:99999;`;
        const card=document.createElement('div');
        card.style.cssText=`background:${bgColor}; color:${textColor}; padding:25px 30px; border-radius:${cardRadius}px;
            display:flex; flex-direction:column; align-items:center; gap:15px; box-shadow:0 10px 30px rgba(0,0,0,0.25);`;
        const spinner=document.createElement('div');
        spinner.style.cssText=`border:4px solid #f3f3f3; border-top:4px solid #2196f3; border-radius:50%; width:40px; height:40px; animation:spin 1s linear infinite;`;
        const msg=document.createElement('div'); msg.textContent=message;
        card.appendChild(spinner); card.appendChild(msg); overlay.appendChild(card); document.body.appendChild(overlay);
        return { close:()=>overlay.remove() };
    };

})();

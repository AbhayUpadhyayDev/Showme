
    (function(){
    // Inject CSS dynamically
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
        border-radius: 4px;
        box-shadow: 0 6px 18px rgba(0,0,0,0.3);
        opacity: 0;
        transform: translateX(120%);
        transition: transform 0.4s cubic-bezier(0.25,1.2,0.5,1), opacity 0.3s ease, margin 0.3s ease;
        pointer-events: auto;
        position: relative;
        overflow: hidden;
        min-width: 250px;
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
    `;
    document.head.appendChild(style);

    // Create container if not exists
    let container = document.getElementById('toast-container');
    if(!container){
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'top-right';
        container.setAttribute('role','region');
        container.setAttribute('aria-live','polite');
        document.body.appendChild(container);
    }

    const activeToasts = [];
    const MAX_TOASTS = 5;

    // Main toast function
    function showme({
        message='',
        type='info',
        duration=4000,
        persistent=false,
        position='top-right',
        bgColor=null,
        textColor=null,
        radius=4,
        animation=false,
        customHTML=null,
        actions=[],
        onShow=null,
        onClose=null,
        onClick=null
    }={}){

        container.className = position;

        const t = document.createElement('div');
        t.className = 'toast '+type;
        t.style.borderRadius = radius+'px';
        if(bgColor) t.style.background = bgColor;
        if(textColor) t.style.color = textColor;
        t.setAttribute('role','alert');

        const msgDiv = document.createElement('div');
        msgDiv.className = 'toast-message';
        if(customHTML) msgDiv.appendChild(customHTML);
        else msgDiv.textContent = message;
        t.appendChild(msgDiv);

        actions.forEach(act=>{
        const btn = document.createElement('button');
        btn.className='toast-action';
        btn.textContent=act.text||'Action';
        btn.onclick=()=>{ act.callback && act.callback(); removeToast(t); };
        t.appendChild(btn);
        });

        const close = document.createElement('span');
        close.className='toast-close';
        close.innerHTML='&times;';
        close.onclick=()=>removeToast(t);
        t.appendChild(close);

        if(!persistent){
        const progress = document.createElement('div');
        progress.className='toast-progress';
        progress.style.animation=`progress ${duration}ms linear forwards`;
        t.appendChild(progress);
        }

        if(onClick) t.addEventListener('click', ()=>onClick(t));

        container.appendChild(t);
        activeToasts.push(t);

        if(activeToasts.length > MAX_TOASTS) removeToast(activeToasts[0]);

        if(animation) requestAnimationFrame(()=>t.classList.add('show'));
        else t.classList.add('show');

        if(onShow) onShow(t);
        if(!persistent) setTimeout(()=>removeToast(t), duration);

        let startX=0;
        t.addEventListener('touchstart', e=>startX=e.touches[0].clientX);
        t.addEventListener('touchend', e=>{ if(e.changedTouches[0].clientX-startX>50) removeToast(t); });

        function removeToast(toastElem){
        toastElem.classList.remove('show');
        toastElem.addEventListener('transitionend', ()=>{
            toastElem.remove();
            const index = activeToasts.indexOf(toastElem);
            if(index>-1) activeToasts.splice(index,1);
            if(onClose) onClose(toastElem);
        });
        }

        return t;
    }

    window.showme = showme;
    })();

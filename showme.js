(function () {
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

    function showmeToast(options = {}) {
        const opts = { ...DEFAULTS, ...options };
        container.className = opts.position;
        const t = document.createElement('div');
        t.className = 'toast ' + (opts.type || '');
        t.style.borderRadius = (opts.radius || 6) + 'px';
        if (opts.bgColor) t.style.background = opts.bgColor;
        if (opts.textColor) t.style.color = opts.textColor;
        t.setAttribute('role', (opts.type === 'error' || opts.type === 'warning') ? 'alert' : 'status');

        const msgDiv = document.createElement('div');
        msgDiv.className = 'toast-message';
        if (opts.customHTML) msgDiv.appendChild(opts.customHTML);
        else msgDiv.textContent = opts.message || '';
        t.appendChild(msgDiv);

        (opts.actions || []).forEach(act => {
            const btn = document.createElement('button');
            btn.className = 'toast-action';
            btn.textContent = act.text || 'Action';
            btn.onclick = e => { e.stopPropagation(); act.callback && act.callback(); removeToast(t); };
            t.appendChild(btn);
        });

        const close = document.createElement('span');
        close.className = 'toast-close'; close.innerHTML = '&times;';
        close.onclick = e => { e.stopPropagation(); removeToast(t); }
        t.appendChild(close);

        let timeout;
        if (!opts.persistent) {
            const progress = document.createElement('div');
            progress.className = 'toast-progress';
            progress.style.animation = `progress ${opts.duration}ms linear forwards`;
            t.appendChild(progress);
            timeout = setTimeout(() => removeToast(t), opts.duration);

            let start = Date.now(), remaining = opts.duration;
            const pauseToast = () => { clearTimeout(timeout); remaining -= Date.now() - start; progress.style.animationPlayState = 'paused'; };
            const resumeToast = () => { start = Date.now(); timeout = setTimeout(() => removeToast(t), remaining); progress.style.animation = `progress ${remaining}ms linear forwards`; progress.style.animationPlayState = 'running'; };
            t.addEventListener('mouseenter', pauseToast);
            t.addEventListener('mouseleave', resumeToast);
        }

        if (opts.onClick) t.addEventListener('click', () => opts.onClick(t));

        container.appendChild(t);
        activeToasts.push(t);
        if (activeToasts.length > opts.maxToasts) removeToast(activeToasts[0]);
        if (opts.animation) requestAnimationFrame(() => t.classList.add('show')); else t.classList.add('show');
        if (opts.onShow) opts.onShow(t);

        let start = Date.now(), remaining = opts.duration;
        t.addEventListener('mouseenter', () => { if (timeout) { clearTimeout(timeout); remaining -= (Date.now() - start); } });
        t.addEventListener('mouseleave', () => { if (timeout) { start = Date.now(); timeout = setTimeout(() => removeToast(t), remaining); } });

        let startX = 0;
        t.addEventListener('touchstart', e => startX = e.touches[0].clientX);
        t.addEventListener('touchend', e => { if (e.changedTouches[0].clientX - startX > 50) removeToast(t); });

        function removeToast(toastElem) {
            if (!toastElem) return;
            toastElem.classList.remove('show');
            toastElem.addEventListener('transitionend', () => {
                toastElem.remove();
                const index = activeToasts.indexOf(toastElem);
                if (index > -1) activeToasts.splice(index, 1);
                if (opts.onClose) opts.onClose(toastElem);
            }, { once: true });
        }

        return { element: t, update: (newOpts = {}) => { if (newOpts.message) msgDiv.textContent = newOpts.message; if (newOpts.bgColor) t.style.background = newOpts.bgColor; if (newOpts.textColor) t.style.color = newOpts.textColor; }, close: () => removeToast(t), on: (event, callback) => t.addEventListener(event, callback) };
    }

    window.showme = function (options) { return showmeToast(options); };
    window.showme.config = function (conf) { Object.assign(DEFAULTS, conf); };

    window.showme.otp = function ({
        length = 6,
        message = "Enter OTP",
        onComplete = null,
        onResend = null,
        bgColor = "#fff",
        otpTextColor = "#000",
        textColor = "#333",
        blockSize = 50,
        blockBorderRadius = 8,
        cardRadius = 12,
        gap = 10,
        overlayBg = "rgba(0,0,0,0.5)",
        inputType = "number",
        autoCloseDelay = 500,
        expiry = 60 
    } = {}) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `position:fixed; top:0; left:0; width:100vw; height:100vh; background:${overlayBg};
        display:flex; justify-content:center; align-items:center; z-index:99999;`;

        const container = document.createElement('div');
        container.style.cssText = `background:${bgColor}; color:${textColor}; padding:25px 30px;
        border-radius:${cardRadius}px; display:flex; flex-direction:column; align-items:center;
        gap:20px; max-width:90%; min-width:300px; box-shadow:0 10px 30px rgba(0,0,0,0.25);`;

        // Title
        const title = document.createElement('div');
        title.textContent = message;
        title.style.cssText = "font-size:1.4em; font-weight:600; text-align:center;";
        container.appendChild(title);

        // Timer display
        const timerDiv = document.createElement('div');
        timerDiv.style.cssText = "font-size:1em; color:#f44336; margin-bottom:10px;";
        container.appendChild(timerDiv);

        // OTP inputs
        const inputContainer = document.createElement('div');
        inputContainer.style.display = 'flex'; inputContainer.style.gap = gap + 'px';
        const inputs = [];
        for (let i = 0; i < length; i++) {
            const inp = document.createElement('input');
            inp.type = 'text'; inp.maxLength = 1;
            inp.style.cssText = `width:${blockSize}px; height:${blockSize}px; text-align:center; font-size:1.5em; border-radius:${blockBorderRadius}px;
            border:1px solid #ccc; outline:none; background:#f9f9f9; color:${otpTextColor}; caret-color:${otpTextColor}; transition:all 0.2s;`;
            inp.addEventListener('focus', () => { inp.style.boxShadow = `0 0 0 2px #2196f3`; inp.style.borderColor = '#2196f3'; });
            inp.addEventListener('blur', () => { inp.style.boxShadow = 'none'; inp.style.borderColor = '#ccc'; });
            inp.addEventListener('input', () => {
                if (inputType === 'number') inp.value = inp.value.replace(/[^0-9]/g, '');
                else if (inputType === 'alphanumeric') inp.value = inp.value.replace(/[^0-9a-zA-Z]/g, '');
                if (inp.value.length > 0 && i < length - 1) inputs[i + 1].focus();
                checkComplete();
            });
            inp.addEventListener('keydown', e => { if (e.key === 'Backspace' && inp.value === '' && i > 0) inputs[i - 1].focus(); });
            inputs.push(inp); inputContainer.appendChild(inp);
        }
        container.appendChild(inputContainer);

        // Resend text
        const resendText = document.createElement('div');
        resendText.textContent = `Resend OTP`;
        resendText.style.cssText = "margin-top:10px; color:gray; cursor:not-allowed; font-size:0.95em; text-decoration:underline;";
        resendText.onclick = () => {
            if (remaining <= 0) {
                if (onResend) onResend();
                remaining = expiry; // reset timer
                inputs.forEach(i => { i.disabled = false; i.value = ''; }); // reset inputs
                inputs[0].focus();
                resendText.style.color = "gray";
                resendText.style.cursor = "not-allowed";
                startTimer();
            }
        };
        container.appendChild(resendText);

        overlay.appendChild(container);
        document.body.appendChild(overlay);
        inputs[0].focus();

        let remaining = expiry;
        let interval;

        function startTimer() {
            clearInterval(interval);
            timerDiv.textContent = `Expires in: ${remaining}s`;
            inputs.forEach(i => i.disabled = false);
            resendText.style.color = "gray";
            resendText.style.cursor = "not-allowed";

            interval = setInterval(() => {
                remaining--;
                if (remaining <= 0) {
                    clearInterval(interval);
                    timerDiv.textContent = "OTP Expired";
                    inputs.forEach(i => i.disabled = true);
                    resendText.style.color = "#2196f3";
                    resendText.style.cursor = "pointer";
                } else {
                    timerDiv.textContent = `Expires in: ${remaining}s`;
                }
            }, 1000);
        }

        startTimer();

        function checkComplete() {
            const otp = inputs.map(i => i.value).join('');
            if (otp.length === length && onComplete) {
                onComplete(otp);
                setTimeout(() => overlay.remove(), autoCloseDelay);
                clearInterval(interval);
            }
        }
    };


    window.showme.confirm = function ({
        message = "Are you sure?", type = "info", onConfirm = null, onCancel = null, bgColor = "#fff",
        textColor = "#333", cardRadius = 12, overlayBg = "rgba(0,0,0,0.5)", confirmText = "Yes", cancelText = "No", icon = null
    } = {}) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `position:fixed; top:0; left:0; width:100vw; height:100vh; background:${overlayBg};
        display:flex; justify-content:center; align-items:center; z-index:99999;`;

        const card = document.createElement('div');
        card.style.cssText = `background:${bgColor}; color:${textColor}; padding:25px 30px; border-radius:${cardRadius}px;
        display:flex; flex-direction:column; align-items:center; gap:20px; max-width:90%; min-width:300px; box-shadow:0 10px 30px rgba(0,0,0,0.25); text-align:center;`;

        if (icon) { const iconEl = document.createElement('div'); iconEl.innerHTML = icon; iconEl.style.fontSize = '2em'; card.appendChild(iconEl); }
        const msg = document.createElement('div'); msg.textContent = message; msg.style.cssText = 'font-size:1.2em; font-weight:500;';
        card.appendChild(msg);

        const btnContainer = document.createElement('div'); btnContainer.style.cssText = 'display:flex; gap:15px;';
        const btnYes = document.createElement('button'); btnYes.textContent = confirmText;
        btnYes.style.cssText = 'padding:8px 18px; background:#4caf50; color:#fff; border:none; border-radius:4px; cursor:pointer;';
        btnYes.onclick = () => { onConfirm && onConfirm(); overlay.remove(); };
        const btnNo = document.createElement('button'); btnNo.textContent = cancelText;
        btnNo.style.cssText = 'padding:8px 18px; background:#f44336; color:#fff; border:none; border-radius:4px; cursor:pointer;';
        btnNo.onclick = () => { onCancel && onCancel(); overlay.remove(); };
        btnContainer.appendChild(btnYes); btnContainer.appendChild(btnNo); card.appendChild(btnContainer);

        overlay.appendChild(card);
        document.body.appendChild(overlay);

     
    };


    window.showme.loading = function ({
        message = "Loading...", bgColor = "#fff", textColor = "#333", cardRadius = 12, overlayBg = "rgba(0,0,0,0.5)"
    } = {}) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `position:fixed; top:0; left:0; width:100vw; height:100vh; background:${overlayBg};
            display:flex; justify-content:center; align-items:center; z-index:99999;`;
        const card = document.createElement('div');
        card.style.cssText = `background:${bgColor}; color:${textColor}; padding:25px 30px; border-radius:${cardRadius}px;
            display:flex; flex-direction:column; align-items:center; gap:15px; box-shadow:0 10px 30px rgba(0,0,0,0.25);`;
        const spinner = document.createElement('div');
        spinner.style.cssText = `border:4px solid #f3f3f3; border-top:4px solid #2196f3; border-radius:50%; width:40px; height:40px; animation:spin 1s linear infinite;`;
        const msg = document.createElement('div'); msg.textContent = message;
        card.appendChild(spinner); card.appendChild(msg); overlay.appendChild(card); document.body.appendChild(overlay);
        return { close: () => overlay.remove() };
    };


    window.showme.form = function({
    title="Enter Information",
    fields=[{label:"Name", type:"text", placeholder:"Enter value"}],
    bgColor="#1b1d2a",
    textColor="#e0e0e0",
    cardRadius=12,
    overlayBg="rgba(0,0,0,0.7)",
    onSubmit=null,
    onCancel=null
}={}) {
    const overlay=document.createElement('div');
    overlay.style.cssText=`position:fixed; top:0; left:0; width:100vw; height:100vh; background:${overlayBg};
        display:flex; justify-content:center; align-items:center; z-index:99999;`;

    const card=document.createElement('div');
    card.style.cssText=`background:${bgColor}; color:${textColor}; padding:25px 30px; border-radius:${cardRadius}px;
        display:flex; flex-direction:column; align-items:center; gap:15px; max-width:90%; min-width:300px; box-shadow:0 10px 30px rgba(0,0,0,0.25);`;

    const titleEl=document.createElement('div');
    titleEl.textContent=title;
    titleEl.style.cssText="font-size:1.4em; font-weight:600; text-align:center;";
    card.appendChild(titleEl);

    const inputEls=[];
    fields.forEach(f=>{
        const input=document.createElement('input');
        input.type=f.type||"text";
        input.placeholder=f.placeholder||"";
        input.style.cssText=`width:100%; padding:8px 12px; border-radius:6px; border:1px solid #444; background:#2b2d3a; color:${textColor}; outline:none;`;
        card.appendChild(input);
        inputEls.push(input);
    });

    const btnContainer=document.createElement('div');
    btnContainer.style.cssText='display:flex; gap:12px; margin-top:10px;';
    const submitBtn=document.createElement('button');
    submitBtn.textContent="Submit";
    submitBtn.style.cssText='padding:8px 16px; background:#2196f3; color:#fff; border:none; border-radius:6px; cursor:pointer;';
    submitBtn.onclick=()=>{ 
        const values=inputEls.map(i=>i.value);
        if(onSubmit) onSubmit(values);
        overlay.remove();
    };
    const cancelBtn=document.createElement('button');
    cancelBtn.textContent="Cancel";
    cancelBtn.style.cssText='padding:8px 16px; background:#f44336; color:#fff; border:none; border-radius:6px; cursor:pointer;';
    cancelBtn.onclick=()=>{
        if(onCancel) onCancel();
        overlay.remove();
    };
    btnContainer.appendChild(submitBtn);
    btnContainer.appendChild(cancelBtn);
    card.appendChild(btnContainer);

    overlay.appendChild(card);
    document.body.appendChild(overlay);
};


/* =========================
   CHOICE / CARD SELECTION POPUP
   ========================= */
window.showme.choice = function({
    title="Select an Option",
    options=[{label:"Option 1", value:1},{label:"Option 2", value:2}],
    bgColor="#1b1d2a",
    textColor="#e0e0e0",
    cardRadius=12,
    overlayBg="rgba(0,0,0,0.7)",
    onSelect=null
}={}) {
    const overlay=document.createElement('div');
    overlay.style.cssText=`position:fixed; top:0; left:0; width:100vw; height:100vh; background:${overlayBg};
        display:flex; justify-content:center; align-items:center; z-index:99999;`;

    const card=document.createElement('div');
    card.style.cssText=`background:${bgColor}; color:${textColor}; padding:25px 30px; border-radius:${cardRadius}px;
        display:flex; flex-direction:column; align-items:center; gap:15px; max-width:90%; min-width:300px; box-shadow:0 10px 30px rgba(0,0,0,0.25);`;

    const titleEl=document.createElement('div');
    titleEl.textContent=title;
    titleEl.style.cssText="font-size:1.4em; font-weight:600; text-align:center;";
    card.appendChild(titleEl);

    const optionContainer=document.createElement('div');
    optionContainer.style.cssText='display:flex; flex-wrap:wrap; gap:12px; justify-content:center; width:100%;';

    options.forEach(opt=>{
        const btn=document.createElement('div');
        btn.textContent=opt.label;
        btn.style.cssText=`padding:10px 16px; border-radius:6px; cursor:pointer; background:#2b2d3a; border:1px solid #444; text-align:center; min-width:80px; transition:0.2s;`;
        btn.onmouseover=()=>{ btn.style.background="#2196f3"; btn.style.color="#fff"; };
        btn.onmouseout=()=>{ btn.style.background="#2b2d3a"; btn.style.color=textColor; };
        btn.onclick=()=>{ if(onSelect) onSelect(opt.value); overlay.remove(); };
        optionContainer.appendChild(btn);
    });

    card.appendChild(optionContainer);
    overlay.appendChild(card);
    document.body.appendChild(overlay);
};

window.showme.info = function({
    title="Info",
    message="This is an info modal.",
    icon=null,
    bgColor="#1b1d2a",
    textColor="#e0e0e0",
    cardRadius=12,
    overlayBg="rgba(0,0,0,0.7)",
    buttons=[{text:"OK", callback:null, bg:"#2196f3", color:"#fff"}]
}={}) {
    const overlay=document.createElement('div');
    overlay.style.cssText=`position:fixed;top:0;left:0;width:100vw;height:100vh;background:${overlayBg};
        display:flex;justify-content:center;align-items:center;z-index:99999;`;
    const card=document.createElement('div');
    card.style.cssText=`background:${bgColor}; color:${textColor}; padding:25px 30px; border-radius:${cardRadius}px;
        display:flex; flex-direction:column; align-items:center; gap:15px; max-width:90%; min-width:300px; box-shadow:0 10px 30px rgba(0,0,0,0.25);`;

    if(icon){
        const iconEl=document.createElement('div'); iconEl.innerHTML=icon;
        iconEl.style.cssText='font-size:2em;'; card.appendChild(iconEl);
    }

    const titleEl=document.createElement('div'); titleEl.textContent=title;
    titleEl.style.cssText="font-size:1.4em;font-weight:600;text-align:center;";
    card.appendChild(titleEl);

    const msg=document.createElement('div'); msg.textContent=message;
    msg.style.cssText='font-size:1.1em;text-align:center;';
    card.appendChild(msg);

    const btnContainer=document.createElement('div'); btnContainer.style.cssText='display:flex;gap:10px;margin-top:10px;';
    buttons.forEach(b=>{
        const btn=document.createElement('button'); btn.textContent=b.text;
        btn.style.cssText=`padding:8px 16px;border:none;border-radius:6px;cursor:pointer;background:${b.bg||"#2196f3"};color:${b.color||"#fff"};`;
        btn.onclick=()=>{
            if(b.callback) b.callback();
            overlay.remove();
        };
        btnContainer.appendChild(btn);
    });
    card.appendChild(btnContainer);

    overlay.appendChild(card); document.body.appendChild(overlay);
};
window.showme.checklist = function({
    title="Select Options",
    options=["Option 1","Option 2","Option 3"],
    bgColor="#1b1d2a",
    textColor="#e0e0e0",
    cardRadius=12,
    overlayBg="rgba(0,0,0,0.7)",
    onConfirm=null,
    confirmText="Submit"
}={}) {
    const overlay=document.createElement('div');
    overlay.style.cssText=`position:fixed;top:0;left:0;width:100vw;height:100vh;background:${overlayBg};
        display:flex;justify-content:center;align-items:center;z-index:99999;`;
    const card=document.createElement('div');
    card.style.cssText=`background:${bgColor};color:${textColor};padding:25px 30px;border-radius:${cardRadius}px;
        display:flex;flex-direction:column;align-items:center;gap:15px;max-width:90%;min-width:300px;box-shadow:0 10px 30px rgba(0,0,0,0.25);`;

    const titleEl=document.createElement('div'); titleEl.textContent=title;
    titleEl.style.cssText='font-size:1.4em;font-weight:600;text-align:center;';
    card.appendChild(titleEl);

    const checkContainer=document.createElement('div'); checkContainer.style.cssText='display:flex;flex-direction:column;gap:8px;width:100%;';
    const checkboxes=[];
    options.forEach(opt=>{
        const wrapper=document.createElement('label'); wrapper.style.cssText='display:flex;align-items:center;gap:8px;cursor:pointer;';
        const cb=document.createElement('input'); cb.type='checkbox';
        cb.style.cssText='width:16px;height:16px;'; checkboxes.push(cb);
        const span=document.createElement('span'); span.textContent=opt;
        wrapper.appendChild(cb); wrapper.appendChild(span); checkContainer.appendChild(wrapper);
    });
    card.appendChild(checkContainer);

    const confirmBtn=document.createElement('button'); confirmBtn.textContent=confirmText;
    confirmBtn.style.cssText='padding:8px 16px;border:none;border-radius:6px;background:#2196f3;color:#fff;cursor:pointer;';
    confirmBtn.onclick=()=>{
        const selected=options.filter((o,i)=>checkboxes[i].checked);
        if(onConfirm) onConfirm(selected);
        overlay.remove();
    };
    card.appendChild(confirmBtn);

    overlay.appendChild(card); document.body.appendChild(overlay);
};


window.showme.rating = function({
    title="Rate this",
    maxStars=5,
    bgColor="#1b1d2a",
    textColor="#e0e0e0",
    cardRadius=12,
    overlayBg="rgba(0,0,0,0.7)",
    onSubmit=null
}={}) {
    const overlay=document.createElement('div');
    overlay.style.cssText=`position:fixed;top:0;left:0;width:100vw;height:100vh;background:${overlayBg};
        display:flex;justify-content:center;align-items:center;z-index:99999;`;
    const card=document.createElement('div');
    card.style.cssText=`background:${bgColor};color:${textColor};padding:25px 30px;border-radius:${cardRadius}px;
        display:flex;flex-direction:column;align-items:center;gap:15px;max-width:90%;min-width:300px;box-shadow:0 10px 30px rgba(0,0,0,0.25);`;

    const titleEl=document.createElement('div'); titleEl.textContent=title;
    titleEl.style.cssText='font-size:1.4em;font-weight:600;text-align:center;';
    card.appendChild(titleEl);

    const starsContainer=document.createElement('div'); starsContainer.style.cssText='display:flex;gap:6px;font-size:2rem;cursor:pointer;';
    const stars=[]; let rating=0;
    for(let i=0;i<maxStars;i++){
        const star=document.createElement('span'); star.textContent='☆';
        star.style.cssText='transition:0.2s;';
        star.onmouseover=()=>{ for(let j=0;j<maxStars;j++) stars[j].textContent=(j<=i?'★':'☆'); };
        star.onclick=()=>{ rating=i+1; if(onSubmit) onSubmit(rating); overlay.remove(); };
        star.onmouseleave=()=>{ for(let j=0;j<maxStars;j++) stars[j].textContent=(j<rating?'★':'☆'); };
        stars.push(star); starsContainer.appendChild(star);
    }
    card.appendChild(starsContainer);

    overlay.appendChild(card); document.body.appendChild(overlay);
};


window.showme.countdown = function({
    title="Wait for it...",
    duration=10,
    actionText="Click Me",
    bgColor="#1b1d2a",
    textColor="#e0e0e0",
    cardRadius=12,
    overlayBg="rgba(0,0,0,0.7)",
    onAction=null
}={}) {
    const overlay=document.createElement('div');
    overlay.style.cssText=`position:fixed;top:0;left:0;width:100vw;height:100vh;background:${overlayBg};
        display:flex;justify-content:center;align-items:center;z-index:99999;`;
    const card=document.createElement('div');
    card.style.cssText=`background:${bgColor};color:${textColor};padding:25px 30px;border-radius:${cardRadius}px;
        display:flex;flex-direction:column;align-items:center;gap:15px;max-width:90%;min-width:300px;box-shadow:0 10px 30px rgba(0,0,0,0.25);`;

    const titleEl=document.createElement('div'); titleEl.textContent=title;
    titleEl.style.cssText='font-size:1.4em;font-weight:600;text-align:center;';
    card.appendChild(titleEl);

    const timerDiv=document.createElement('div'); timerDiv.textContent=`${duration}s`;
    timerDiv.style.cssText='font-size:1.2em;'; card.appendChild(timerDiv);

    const btn=document.createElement('button'); btn.textContent=actionText;
    btn.disabled=true; btn.style.cssText='padding:8px 16px;border:none;border-radius:6px;background:#2196f3;color:#fff;cursor:pointer;';
    btn.onclick=()=>{ if(onAction) onAction(); overlay.remove(); };
    card.appendChild(btn);

    overlay.appendChild(card); document.body.appendChild(overlay);

    let remaining=duration;
    const interval=setInterval(()=>{
        remaining--; timerDiv.textContent=`${remaining}s`;
        if(remaining<=0){ clearInterval(interval); btn.disabled=false; timerDiv.textContent=""; }
    },1000);
};



// ==================== 1️⃣ File Upload / Drag & Drop Modal ====================
window.showme.fileUpload = function({
    title="Upload File",
    multiple=false,
    accept="*/*",
    bgColor="#1b1d2a",
    textColor="#e0e0e0",
    cardRadius=8,
    overlayBg="rgba(0,0,0,0.7)",
    onUpload=null,
    onCancel=null
}={}) {
    const overlay=document.createElement('div');
    overlay.style.cssText=`position:fixed;top:0;left:0;width:100vw;height:100vh;background:${overlayBg};
        display:flex;justify-content:center;align-items:center;z-index:99999;`;

    const card=document.createElement('div');
    card.style.cssText=`background:${bgColor}; color:${textColor}; padding:25px 30px; border-radius:${cardRadius}px;
        display:flex; flex-direction:column; align-items:center; gap:15px; max-width:90%; min-width:300px;`;

    const titleEl=document.createElement('div'); titleEl.textContent=title;
    titleEl.style.cssText="font-size:1.4em;font-weight:600;text-align:center;";
    card.appendChild(titleEl);

    const dropArea=document.createElement('div');
    dropArea.style.cssText=`width:100%; padding:20px; border:2px dashed #444; border-radius:8px; text-align:center; cursor:pointer; transition:0.2s;`;
    dropArea.textContent="Drag & drop files here or click to select";

    dropArea.addEventListener('dragover', e=>{ e.preventDefault(); dropArea.style.borderColor="#2196f3"; });
    dropArea.addEventListener('dragleave', e=>{ dropArea.style.borderColor="#444"; });
    dropArea.addEventListener('drop', e=>{ 
        e.preventDefault(); dropArea.style.borderColor="#444"; 
        const files = Array.from(e.dataTransfer.files);
        if(onUpload) onUpload(files); overlay.remove();
    });
    const input=document.createElement('input'); input.type="file"; input.multiple=multiple; input.accept=accept; input.style.display="none";
    input.addEventListener('change', ()=>{ if(onUpload) onUpload(Array.from(input.files)); overlay.remove(); });
    dropArea.onclick=()=>input.click();

    card.appendChild(dropArea); card.appendChild(input);

    const cancelBtn=document.createElement('button'); cancelBtn.textContent="Cancel";
    cancelBtn.style.cssText='padding:8px 16px; margin-top:10px; border:none; border-radius:6px; background:#555; color:#fff; cursor:pointer;';
    cancelBtn.onclick=()=>{ if(onCancel) onCancel(); overlay.remove(); };
    card.appendChild(cancelBtn);

    overlay.appendChild(card); document.body.appendChild(overlay);
};

// ==================== 2️⃣ Tabbed / Multi-section Modal ====================
window.showme.tabs = function({
    title="Settings",
    tabs=[{label:"Tab 1", content:"Content 1"},{label:"Tab 2", content:"Content 2"}],
    bgColor="#1b1d2a",
    textColor="#e0e0e0",
    cardRadius=8,
    overlayBg="rgba(0,0,0,0.7)"
}={}) {
    const overlay=document.createElement('div');
    overlay.style.cssText=`position:fixed;top:0;left:0;width:100vw;height:100vh;background:${overlayBg};
        display:flex;justify-content:center;align-items:center;z-index:99999;`;

    const card=document.createElement('div');
    card.style.cssText=`background:${bgColor}; color:${textColor}; padding:20px; border-radius:${cardRadius}px;
        display:flex; flex-direction:column; gap:15px; max-width:90%; min-width:300px; position:relative;`;

    // Close button
    const closeBtn=document.createElement('span');
    closeBtn.innerHTML='&times;';
    closeBtn.style.cssText='position:absolute; top:10px; right:12px; font-size:1.5em; cursor:pointer; color:#fff;';
    closeBtn.onclick=()=>overlay.remove();
    card.appendChild(closeBtn);

    const titleEl=document.createElement('div'); titleEl.textContent=title;
    titleEl.style.cssText='font-size:1.4em;font-weight:600;text-align:center;';
    card.appendChild(titleEl);

    const tabHeader=document.createElement('div'); tabHeader.style.cssText='display:flex; gap:10px;';
    const tabContent=document.createElement('div'); tabContent.style.cssText='padding:10px; border-top:1px solid #444;';
    card.appendChild(tabHeader); card.appendChild(tabContent);

    tabs.forEach((t,i)=>{
        const btn=document.createElement('button'); btn.textContent=t.label;
        btn.style.cssText='padding:6px 12px; border:none; border-radius:4px; background:#333; color:#fff; cursor:pointer;';
        btn.onclick=()=>{
            Array.from(tabHeader.children).forEach(b=>b.style.background='#333');
            btn.style.background='#2196f3';
            tabContent.textContent=t.content;
        };
        tabHeader.appendChild(btn);
        if(i===0){ btn.style.background='#2196f3'; tabContent.textContent=t.content; }
    });

    overlay.appendChild(card); document.body.appendChild(overlay);
};


// ==================== Carousel / Media Viewer Modal (with skeleton & fade) ====================
window.showme.carousel = function({
    images=[],
    bgColor="#1b1d2a",
    textColor="#e0e0e0",
    cardRadius=8,
    overlayBg="rgba(0,0,0,0.7)",
    width=400,
    height=300
}={}) {
    if(images.length===0) return;
    let index=0;

    const overlay=document.createElement('div');
    overlay.style.cssText=`position:fixed;top:0;left:0;width:100vw;height:100vh;background:${overlayBg};
        display:flex;justify-content:center;align-items:center;z-index:99999;`;

    const card=document.createElement('div');
    card.style.cssText=`background:${bgColor}; color:${textColor}; padding:20px; border-radius:${cardRadius}px;
        display:flex; flex-direction:column; align-items:center; gap:10px; max-width:90%; max-height:90%;`;

    // Skeleton / Placeholder
    const skeleton=document.createElement('div');
    skeleton.style.cssText=`width:${width}px; height:${height}px; background:#333; border-radius:6px; position:relative; overflow:hidden;`;
    skeleton.innerHTML=`<div style="position:absolute; top:0; left:-100%; width:100%; height:100%; background:linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); animation: shimmer 1.5s infinite;"></div>`;
    card.appendChild(skeleton);

    // Image element
    const imgEl=document.createElement('img');
    imgEl.style.cssText=`max-width:${width}px; max-height:${height}px; border-radius:6px; display:none; transition: opacity 0.5s ease;`;
    card.appendChild(imgEl);

    function loadImage(i) {
        skeleton.style.display='block';
        imgEl.style.display='none';
        const img=new Image();
        img.src=images[i];
        img.onload=()=>{
            imgEl.src=img.src;
            skeleton.style.display='none';
            imgEl.style.opacity=0;
            imgEl.style.display='block';
            requestAnimationFrame(()=>imgEl.style.opacity=1);
        };
    }
    loadImage(index);

    // Navigation buttons
    const nav=document.createElement('div'); nav.style.cssText='display:flex; gap:10px;';
    const prevBtn=document.createElement('button'); prevBtn.textContent='Prev';
    prevBtn.style.cssText='padding:6px 12px; border:none; border-radius:4px; background:#555; color:#fff; cursor:pointer;';
    prevBtn.onclick=()=>{ index=(index-1+images.length)%images.length; loadImage(index); };
    const nextBtn=document.createElement('button'); nextBtn.textContent='Next';
    nextBtn.style.cssText='padding:6px 12px; border:none; border-radius:4px; background:#555; color:#fff; cursor:pointer;';
    nextBtn.onclick=()=>{ index=(index+1)%images.length; loadImage(index); };
    nav.appendChild(prevBtn); nav.appendChild(nextBtn); card.appendChild(nav);

    // Close button
    const closeBtn=document.createElement('button'); closeBtn.textContent='Close';
    closeBtn.style.cssText='padding:6px 12px; border:none; border-radius:4px; background:#f44336; color:#fff; cursor:pointer;';
    closeBtn.onclick=()=>overlay.remove(); card.appendChild(closeBtn);

    // Add card & overlay
    overlay.appendChild(card); document.body.appendChild(overlay);

    // Shimmer animation
    const style=document.createElement('style');
    style.textContent=`@keyframes shimmer {0% {left:-100%;} 100% {left:100%;}}`;
    document.head.appendChild(style);
};

// ==========================
// 1️⃣ Quick Tooltip / Hover Info
// ==========================
window.showme.tooltip = function({
    target=null,
    message="Tooltip",
    bgColor="#333",
    textColor="#fff",
    padding="6px 10px",
    borderRadius=4,
    duration=3000
}={}) {
    if(!target) return;
    const tip = document.createElement('div');
    tip.textContent = message;
    tip.style.cssText = `
        position:absolute; background:${bgColor}; color:${textColor}; padding:${padding};
        border-radius:${borderRadius}px; font-size:0.9em; pointer-events:none;
        opacity:0; transition:opacity 0.3s;
        z-index:99999;
    `;
    document.body.appendChild(tip);
    
    const rect = target.getBoundingClientRect();
    tip.style.top = rect.top - tip.offsetHeight - 6 + window.scrollY + 'px';
    tip.style.left = rect.left + (rect.width - tip.offsetWidth)/2 + window.scrollX + 'px';
    
    requestAnimationFrame(()=>tip.style.opacity=1);
    setTimeout(()=>{ tip.style.opacity=0; tip.addEventListener('transitionend',()=>tip.remove()); }, duration);
};

// ==========================
// 2️⃣ Mini Badge / Counter
// ==========================
window.showme.badge = function({
    target=null,
    count=0,
    bgColor="#f44336",
    textColor="#fff",
    size=20,
    position="top-right"
}={}) {
    if(!target) return;
    const badge = document.createElement('div');
    badge.textContent = count;
    badge.style.cssText = `
        position:absolute; width:${size}px; height:${size}px; border-radius:50%;
        background:${bgColor}; color:${textColor}; display:flex; align-items:center; justify-content:center;
        font-size:${size*0.6}px; font-weight:bold; z-index:99999;
    `;
    const rect = target.getBoundingClientRect();
    const offsets = {
        "top-right": {top: rect.top-5+window.scrollY, left: rect.right-size/2+window.scrollX},
        "top-left": {top: rect.top-5+window.scrollY, left: rect.left-size/2+window.scrollX},
        "bottom-right": {top: rect.bottom-size/2+window.scrollY, left: rect.right-size/2+window.scrollX},
        "bottom-left": {top: rect.bottom-size/2+window.scrollY, left: rect.left-size/2+window.scrollX},
    };
    badge.style.top = offsets[position].top+'px';
    badge.style.left = offsets[position].left+'px';
    document.body.appendChild(badge);
    return {
        update: val => badge.textContent = val,
        remove: () => badge.remove()
    };
};

// ==========================
// 3️⃣ Inline Spinner / Loader
// ==========================
window.showme.inlineLoader = function({
    target=null,
    size=16,
    color="#2196f3",
    borderWidth=2
}={}) {
    if(!target) return;
    const loader = document.createElement('div');
    loader.style.cssText = `
        border:${borderWidth}px solid #f3f3f3; border-top:${borderWidth}px solid ${color};
        border-radius:50%; width:${size}px; height:${size}px; animation: spin 1s linear infinite;
        display:inline-block; vertical-align:middle;
    `;
    target.appendChild(loader);
    return { remove: () => loader.remove() };
};

// ==========================
// 4️⃣ Mini Snackbar / Bottom Message
// ==========================
window.showme.snackbar = function({
    message="Message",
    duration=3000,
    bgColor="#333",
    textColor="#fff",
    bottom=20,
    left="50%",
    transform="-50%,0"
}={}) {
    const sb = document.createElement('div');
    sb.textContent = message;
    sb.style.cssText = `
        position:fixed; bottom:${bottom}px; left:${left}; transform:translate(${transform});
        background:${bgColor}; color:${textColor}; padding:10px 16px; border-radius:6px;
        font-size:0.95em; opacity:0; transition:opacity 0.3s; z-index:99999;
    `;
    document.body.appendChild(sb);
    requestAnimationFrame(()=>sb.style.opacity=1);
    setTimeout(()=>{ sb.style.opacity=0; sb.addEventListener('transitionend',()=>sb.remove()); }, duration);
};

// ==========================
// 5️⃣ Floating Action Button (FAB)
// ==========================
window.showme.fab = function({
    icon="+",
    bottom=20,
    right=20,
    size=50,
    bgColor="#2196f3",
    textColor="#fff",
    onClick=null
}={}) {
    const fab = document.createElement('button');
    fab.innerHTML = icon;
    
    fab.style.cssText = `
        position:fixed; bottom:${bottom}px; right:${right}px; width:${size}px; height:${size}px;
        border:none; border-radius:50%; background:${bgColor}; color:${textColor};
        font-size:${size*0.5}px; cursor:pointer; display:flex; align-items:center; justify-content:center;
        box-shadow:0 4px 12px rgba(0,0,0,0.3); z-index:99999;
    `;
    fab.onclick = e => { if(onClick) onClick(e); };
    document.body.appendChild(fab);
    return { remove: () => fab.remove() };
};

// Spinner animation keyframes
const spinnerStyle = document.createElement('style');
spinnerStyle.textContent = `@keyframes spin {0% {transform:rotate(0deg);} 100% {transform:rotate(360deg);}}`;
document.head.appendChild(spinnerStyle);


// ==================== 4️⃣ Search / Autocomplete Modal ====================
window.showme.search = function({
    title="Search",
    data=[],
    placeholder="Type to search...",
    bgColor="#1b1d2a",
    textColor="#e0e0e0",
    cardRadius=8,
    overlayBg="rgba(0,0,0,0.7)",
    onSelect=null
}={}) {
    const overlay=document.createElement('div');
    overlay.style.cssText=`position:fixed;top:0;left:0;width:100vw;height:100vh;background:${overlayBg};
        display:flex;justify-content:center;align-items:center;z-index:99999;`;

    const card=document.createElement('div');
    card.style.cssText=`background:${bgColor}; color:${textColor}; padding:20px; border-radius:${cardRadius}px;
        display:flex; flex-direction:column; gap:10px; max-width:400px;`;

    const titleEl=document.createElement('div'); titleEl.textContent=title;
    titleEl.style.cssText='font-size:1.4em;font-weight:600;text-align:center;';
    card.appendChild(titleEl);

    const input=document.createElement('input');
    input.type='text'; input.placeholder=placeholder;
    input.style.cssText='padding:8px; border-radius:6px; border:1px solid #444; background:#222; color:#fff; outline:none;';
    card.appendChild(input);

    const results=document.createElement('div'); results.style.cssText='max-height:200px; overflow-y:auto; display:flex; flex-direction:column; gap:4px;';
    card.appendChild(results);

    function updateResults() {
        results.innerHTML='';
        const val=input.value.toLowerCase();
        data.filter(d=>d.toLowerCase().includes(val)).forEach(d=>{
            const r=document.createElement('div'); r.textContent=d;
            r.style.cssText='padding:6px; cursor:pointer; border-radius:4px; background:#333;';
            r.onmouseenter=()=>r.style.background="#2196f3";
            r.onmouseleave=()=>r.style.background="#333";
            r.onclick=()=>{ if(onSelect) onSelect(d); overlay.remove(); };
            results.appendChild(r);
        });
    }
    input.addEventListener('input', updateResults);

    overlay.appendChild(card); document.body.appendChild(overlay);
    input.focus();
};



/* =========================
   PROGRESS / STEPPER POPUP
   ========================= */
window.showme.progress = function({
    title="Processing...",
    steps=["Step 1","Step 2","Step 3"],
    currentStep=0,
    bgColor="#1b1d2a",
    textColor="#e0e0e0",
    cardRadius=12,
    overlayBg="rgba(0,0,0,0.7)"
}={}) {
    const overlay=document.createElement('div');
    overlay.style.cssText=`position:fixed; top:0; left:0; width:100vw; height:100vh; background:${overlayBg};
        display:flex; justify-content:center; align-items:center; z-index:99999;`;

    const card=document.createElement('div');
    card.style.cssText=`background:${bgColor}; color:${textColor}; padding:25px 30px; border-radius:${cardRadius}px;
        display:flex; flex-direction:column; align-items:center; gap:15px; max-width:90%; min-width:300px; box-shadow:0 10px 30px rgba(0,0,0,0.25);`;

    const titleEl=document.createElement('div');
    titleEl.textContent=title;
    titleEl.style.cssText="font-size:1.4em; font-weight:600; text-align:center;";
    card.appendChild(titleEl);

    // Stepper bar
    const barContainer=document.createElement('div');
    barContainer.style.cssText='display:flex; width:100%; height:12px; background:#2b2d3a; border-radius:6px; overflow:hidden; margin-top:10px;';
    const progressBar=document.createElement('div');
    progressBar.style.cssText=`width:${((currentStep+1)/steps.length)*100}%; background:#2196f3; height:100%; transition:0.3s;`;
    barContainer.appendChild(progressBar);
    card.appendChild(barContainer);

    // Step text
    const stepText=document.createElement('div');
    stepText.textContent=`${steps[currentStep] || ""}`;
    stepText.style.cssText="margin-top:5px; font-weight:500;";
    card.appendChild(stepText);

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    return {
        next: ()=>{
            if(currentStep<steps.length-1) currentStep++;
            progressBar.style.width=`${((currentStep+1)/steps.length)*100}%`;
            stepText.textContent=`${steps[currentStep]}`;
        },
        prev: ()=>{
            if(currentStep>0) currentStep--;
            progressBar.style.width=`${((currentStep+1)/steps.length)*100}%`;
            stepText.textContent=`${steps[currentStep]}`;
        },
        close: ()=>overlay.remove()
    };
};

})();

(function () {
    function select(selector, root = document) {
        return root.querySelector(selector);
    }
    function selectAll(selector, root = document) {
        return Array.from(root.querySelectorAll(selector));
    }

    function setActiveTab(target) {
        const tabs = selectAll('.tab');
        const panels = selectAll('.panel');
        tabs.forEach((t) => {
            const isActive = t === target;
            t.classList.toggle('active', isActive);
            t.setAttribute('aria-selected', String(isActive));
        });
        panels.forEach((p) => p.classList.remove('active'));
        const panelId = target.getAttribute('aria-controls');
        const panel = select(`#${panelId}`);
        if (panel) panel.classList.add('active');
    }

    function calculateAge(isoDate) {
        const birth = new Date(isoDate);
        if (isNaN(birth)) return null;
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    }

    function toggleContactFields(scope) {
        const method = select(`input[name="${scope}-contact-method"]:checked`)?.value || 'email';
        const emailInput = select(`#${scope}-email`);
        const phoneInput = select(`#${scope}-phone`);
        if (!emailInput || !phoneInput) return;
        const useEmail = method === 'email';
        emailInput.classList.toggle('hidden', !useEmail);
        phoneInput.classList.toggle('hidden', useEmail);

        emailInput.required = useEmail;
        phoneInput.required = !useEmail;
        if (useEmail) {
            phoneInput.value = '';
        } else {
            emailInput.value = '';
        }
    }

    function setupContactToggle(scope) {
        selectAll(`input[name="${scope}-contact-method"]`).forEach((el) => {
            el.addEventListener('change', () => toggleContactFields(scope));
        });
        toggleContactFields(scope);
    }

    function setupOtpStubs(scope) {
        const status = select(`.otp-status[data-scope="${scope}"]`);
        const input = select(`.otp-input[data-scope="${scope}"]`);
        const sendBtn = select(`button[data-action="send-otp"][data-scope="${scope}"]`);
        const verifyBtn = select(`button[data-action="verify-otp"][data-scope="${scope}"]`);
        if (!status || !input || !sendBtn || !verifyBtn) return;

        sendBtn.addEventListener('click', () => {
            status.textContent = 'Sending OTP...';
            setTimeout(() => {
                status.textContent = 'OTP sent. Check your ' + (select(`input[name="${scope}-contact-method"]:checked`)?.value || 'email') + '.';
            }, 600);
        });

        verifyBtn.addEventListener('click', () => {
            const code = (input.value || '').trim();
            if (!/^[0-9]{4,8}$/.test(code)) {
                status.textContent = 'Enter a valid OTP.';
                return;
            }
            status.textContent = 'Verifying...';
            setTimeout(() => {
                status.textContent = 'Verified ✓';
                status.style.color = 'var(--success)';
            }, 500);
        });
    }

    function setupStudentUnder18() {
        const dob = select('#student-dob');
        const guardianGroup = select('#student-guardian-group');
        function updateGuardianVisibility() {
            const age = dob.value ? calculateAge(dob.value) : null;
            const isMinor = age !== null && age < 18;
            guardianGroup.hidden = !isMinor;
        }
        if (dob && guardianGroup) {
            dob.addEventListener('change', updateGuardianVisibility);
            updateGuardianVisibility();
        }
    }

    function validateGuardianIfNeeded(form) {
        const dob = select('#student-dob');
        if (!dob || !dob.value) return true;
        const age = calculateAge(dob.value);
        if (age !== null && age < 18) {
            const email = select('#student-guardian-email');
            const phone = select('#student-guardian-phone');
            const hasEmail = !!(email && email.value.trim());
            const hasPhone = !!(phone && phone.value.trim());
            if (!hasEmail && !hasPhone) {
                alert('For under-18, provide guardian email or phone.');
                return false;
            }
        }
        return true;
    }

    function setupFormSubmit(formId) {
        const form = select(`#${formId}`);
        if (!form) return;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            if (formId === 'student-form' && !validateGuardianIfNeeded(form)) {
                return;
            }
            const data = new FormData(form);
            const obj = {};
            for (const [k, v] of data.entries()) {
                if (obj[k]) {
                    if (Array.isArray(obj[k])) obj[k].push(v);
                    else obj[k] = [obj[k], v];
                } else {
                    obj[k] = v;
                }
            }
            console.log(formId + ' submission', obj);
            const dlg = select('#success-dialog');
            if (typeof dlg?.showModal === 'function') {
                dlg.showModal();
            } else {
                alert('Signup submitted.');
            }
            form.reset();
            if (formId === 'student-form') {
                toggleContactFields('student');
                setupStudentUnder18();
            } else {
                toggleContactFields('contrib');
            }
        });
    }

    function init() {
        selectAll('.tab').forEach((btn) => {
            btn.addEventListener('click', () => setActiveTab(btn));
        });

        setupContactToggle('student');
        setupContactToggle('contrib');

        setupOtpStubs('student');
        setupOtpStubs('contrib');

        setupStudentUnder18();

        setupFormSubmit('student-form');
        setupFormSubmit('contributor-form');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
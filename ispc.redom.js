// 
// Classi JS specifiche per progetto APPOINTER 
// (c) 2020 Infoservice srl www.infoservicenet.it
//by Daniele Massi
//
/**
 * Dipendenza: Redom;
 */
/**
 * Func / methods per il template
 */

const globals = {
    timeFormat: 'dddd D MMMM, YYYY',
    urls: {
        list_clienti: 'ispc_plist_clienti_portlet.jsp',
        list_saldirap: 'ispc_plist_saldirap_portlet.jsp',
        list_docs: 'ispc_plist_documenti_portlet.jsp',
        view_cliente: 'ispc_pview_cliente_portlet.jsp',
        view_task: 'ispc_pview_task_portlet.jsp',
    },
    colorArray: ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
        '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
        '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
        '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
        '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
        '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
        '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
        '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
        '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
        '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'
    ],
}

function setHeaderTitle(txt) { // Utility per Titolo su Header;
    try {
        ZtVWeb.getPortlet('istpl_header').setTitle(txt);
    } catch (e) {}
}

function setHeaderSubtitle(txt) { // Utility per Sottotitolo su Header;
    try {
        ZtVWeb.getPortlet('istpl_header').setSubtitle(txt);
    } catch (e) {}
}

function setHeaderBackButton(bool) { // Utility per Pulsante INDIETRO su Header;
    try {
        ZtVWeb.getPortlet('istpl_header').setBackButton(bool);
    } catch (e) {}
}

function hideToolbar() { // Utility per Titolo su Toolbar;
    try {
        ZtVWeb.getPortlet('istpl_toolbar').addCss('hidden');
    } catch (e) {}
}

function showToolbar() { // Utility per Titolo su Toolbar;
    try {
        ZtVWeb.getPortlet('istpl_toolbar').removeCss('hidden');
    } catch (e) {}
}

function clearToolbar() { // Utility per Titolo su Toolbar;
    try {
        ZtVWeb.getPortlet('istpl_toolbar').clearDom();
    } catch (e) {}
}


function mountToolbar(a) { // Utility per Titolo su Toolbar;
    try {
        ZtVWeb.getPortlet('istpl_toolbar').mountDom(a);
    } catch (e) {}
}

function setToolbarTitle(txt) { // Utility per Titolo su Toolbar;
    try {
        ZtVWeb.getPortlet('istpl_toolbar').setTitle(txt);
    } catch (e) {}
}

/**
 * Classi Specifiche per Portale Commerciali;
 */

class LiCliente {
    constructor() {
        this.data = null;

        this.el = el('li.customer.item',
            // this.a = el('a', { href: 'javascript:void(0)' },
            this.icon = new Avatar(),
            // this.text = el('.text',
            //     this.title = el('.title'),
            //     this.subtittle = el('.subtitle'),
            // )
            // )
        );
        this.el.onclick = evt => {
            const event = new CustomEvent("click_cliente", { detail: this.data });
            document.dispatchEvent(event);
        }

    }

    update(data, index, items, context) {

        this.data = data;
        // console.log('data', index, data);
        this.icon.name = data.KSDESCRI;
        this.icon.surname = data.OFLOCAL;
        // this.object.textContent = data.TITLE;
        // this.where.textContent = data.WHERE;
        // this.when.textContent = dayjs(data.TEPREVBEGIN).format()

    }
}


class LiContratto {
    constructor() {
        this.data = null;

        this.el = el('li.contratto.item',
            this.protocollo = el('.protocollo'),
            this.impianto = el('.impianto'),
            this.sede = el('.sede'),

        );
        this.el.onclick = evt => {
            const event = new CustomEvent("click_contratto", { detail: this.data });
            document.dispatchEvent(event);
        }

    }

    update(data, index, items, context) {

        this.data = data;
        // console.log('data', index, data);
        this.protocollo.innerHTML = data.CONUMPRO + '<br/>' + dayjs(data.CODATPRO).format('MM YYYY');
        this.impianto.innerHTML = data.TIPIMP + ' ' + data.IMCODIMP + ' del ' + data.IMANNO;
        this.sede = data.IMLOCAL + '<BR/>' + data.IMINDIRI;

    }
}

class LiFile {
    constructor() {
        this.data = null;
        this.el = el('li.file',
            this.preview = el('.preview'),
            this.title = el('.title'),
        );
        this.el.onclick = evt => {
            const event = new CustomEvent("click_file", { detail: this.data });
            document.dispatchEvent(event);
        }
    }
    update(data, index, items, context) {
        this.data = data;
        this.preview.innerHTML = "<img class='img-fluid' src='../servlet/gsdm_btlk_openfile?p_mode=inline&amp;p_VFCODICEID=" + data.VFCODICEID + "&amp;p_VFAUTHCODE=" + data.VFAUTHCODE + "&amp;p_w=150'></img>";
        this.title.innerHTML = data.VFNAME;
    }
}

class LiImpianto {
    constructor() {
        this.data = null;

        this.el = el('li.impianto.item',
            this.codice = el('.codice'),
            this.impianto = el('.impianto'),
            this.cat = el('.cat'),
            this.sede = el('.sede'),

        );
        this.el.onclick = evt => {
            const event = new CustomEvent("click_impianto", { detail: this.data });
            document.dispatchEvent(event);
        }

    }

    formatAddress() {
        let txt = '';
        this.data.IMLOCAL.trim().length ? txt += this.data.IMLOCAL + ' (' + this.data.IMPROV.trim() + ')' : '';
        this.data.IMINDIRI.trim().length ? txt += '<br/>' + this.data.IMINDIRI : '';
        this.data.IMCAP.trim().length ? txt += '<br/>Cap: ' + this.data.IMCAP : '';
        this.data.ZODESCRI.trim().length ? txt += '<br/>Zona: ' + this.data.ZODESCRI : '';

        return txt;
    }

    update(data, index, items, context) {

        this.data = data;
        // console.log('data', index, data);
        this.codice.innerHTML = data.IMCODIMP + '<br/>' + dayjs(data.CODATPRO).format('MM YYYY');
        this.impianto.innerHTML = data.IMNUMIMP + ' del ' + data.IMANNO;
        this.cat.innerHTML = data.IMTIPIMP + ' ' + data.CATIMP;
        this.sede = this.formatAddress();

    }


}

class LiTask {
    constructor() {
        this.data = null;

        this.el = el('li.task.item',
            // this.a = el('a', { href: 'javascript:void(0)' },
            this.when = el('.when'),
            this.time = el('.time'),
            this.what = el('.what',
                this.who = el('.who'),
                this.object = el('.object'),
            ),
            this.where = el('.where'),
            // this.status = el('.status'),
            // )
        );
        this.el.onclick = evt => {
            const event = new CustomEvent("click_task", { detail: this.data });
            document.dispatchEvent(event);
        }

    }

    update(data, index, items, context) {

        this.data = data;
        // console.log('data', index, data);

        this.el.classList.add(data.raw.TESTATO);

        this.who.textContent = data.raw.EXPVALUE;
        this.object.textContent = data.raw.TETITLE;
        this.where.innerHTML = this.formatAddress(data.raw);
        // this.when.innerHTML = dayjs(data.raw.TEPREVBEGIN).format('dddd D MMMM, YYYY');
        this.when.innerHTML = this.formatTaskDate(data.raw);
        this.time.innerHTML = dayjs(data.raw.TEPREVBEGIN).format('HH:mm') + ' ' + dayjs(data.raw.TEPREVEND).format('HH:mm');
        // this.status.innerHTML = data.raw.TESTATO;
    }

    formatTaskDate(itm) {
        const d = dayjs(itm.TEPREVBEGIN);
        let txt = '';
        txt += '<span class="month">' + d.format('MMM') + ' ' + d.format('YYYY') + '</span>';
        txt += '<span class="day">' + d.format('D') + '</span>';
        txt += '<span class="dayofweek">' + d.format('dddd') + '</span>';
        // txt = dayjs(itm.TEPREVBEGIN).format('dddd D MMMM, YYYY');
        return txt;
    }

    formatAddress(itm) {
        let txt = '';
        itm.TELOCATION ? txt += '<b>' + itm.TELOCATION + '</b><br/><br/>' : '';
        itm.OFLOCAL.trim().length ? txt += itm.OFLOCAL + ' (' + itm.OFPROV.trim() + ')' : '';
        // txt += '<BR/>';
        itm.OFADDRESS.trim().length ? txt += '<br/>' + itm.OFADDRESS : '';
        itm.OFMAIL.trim().length ? txt += '<br/>' + itm.OFMAIL : '';
        itm.OFPHONE.trim().length ? txt += '<br/>' + itm.OFPHONE : '';

        return txt;
    }
}

class CounterBox {

    constructor(name, value, iconClass, containerClass = '.col') {
        this.el = el(containerClass,
            this.box = el('.counterbox',
                this.icon = el('i.icon', { class: 'fas ' + iconClass }),
                this.value = el('.value', { textContent: value }),
                this.name = el('.label', { textContent: name }),
            ),
        );
        this.el.onclick = evt => {
            const event = new CustomEvent("click_counterbox", { detail: this.name.textContent });
            document.dispatchEvent(event);
        }
    }

    update(value) {
        this.value.textContent = value;
    }

}

class CustomerLi {
    /*
    Usato come List-item element
    */

    constructor() {
        this.data = null;

        this.el = el('li.customer.item',

            this.avatar = new Avatar(),
            el('.info',
                // this.title = el('h3'),
                this.label = el('p')
            ),

        );
        this.el.onclick = evt => {
            const event = new CustomEvent("click_customer_li", { detail: this.data });
            document.dispatchEvent(event);
        }

    }

    update(data, index, items, context) {

        this.data = data;
        this.avatar.name = data.title;
        // this.title.textContent = data.title;
        this.label.textContent = data.label;
        //this.el.classList.add('stato_' + data.FLACTIVE);

    }
}

class BookingTimeSlot {
    /*
    Usato come oggetto in selezione fasce orarie 
    nei portlet di prenotazione rapida
    */
    constructor() {
        this.data = null;
        this.selected = false;
        this.image = null;

        this.el = el('li.item.timeslot',
            this.a = el('a', { href: 'javascript:void(0)' },
                this.sp_icon = el('span.icon'),
                this.text = el('span.text')
            )
        );

        this.el.onclick = evt => {
            // this.a.onclick = evt => {

            this.selected = !this.selected;
            this.el.classList.toggle('selected');

            const event = new CustomEvent("click_timeslot", { detail: { el: this.el, obj: this, data: this.data } });
            document.dispatchEvent(event);
        }

    }
    update(data, index, items, context) {

        let txt;
        this.data = data;
        this.el.classList.add(data.STATO);
        switch (data.STATO) {
            case 'FREE':
                txt = '<span class="from">' + data.FOORAINI + '</span><span class="to"> ' + data.FOORAFIN + '</span>';
                break;
            case 'BUSY':
                txt = 'Occupato';
                break;
            case 'OFFS':
                txt = 'Non disponibile';
                break;

        }
        this.text.innerHTML = txt;
        this.el.id = 'li_' + data.SECODICE + '_' + data.RICODICE + '_' + data.CPROWNUM;
        this.a.id = 'a_' + data.SECODICE + '_' + data.RICODICE + '_' + data.CPROWNUM;

        if (data.icon) {
            this.image = new Image(data.icon);
            mount(this.sp_icon, this.image);
        }

    }
}

/**
 * 
 * List Item Element stepper in isap_pbooking_steps_tpl_pa_portlet.jsp
 * 
 */

class StepItem {

    /**
     * Stepper per Wizard prenotazione (valido per ogni wizard);
     * @param {*} number NUM. PAGINA
     * @param {*} title  TITOLO PAGINA
     * @param {*} selected SELEZIONATO O MENO
     */

    constructor(number, title, selected = false, clickEvent = true) {
        this.el = el('li.step',
            el('.txt',
                this.num = el('span', { textContent: number + '.' }),
                this.title = el('span', { textContent: title }),
            ),
            this.bar = el('.bar'),
        );
        if (clickEvent) {
            this.el.onclick = evt => {
                const event = new CustomEvent("step_click", { detail: { el: this.el, obj: this, data: this.data } });
                document.dispatchEvent(event);
            }
        }
        this.data = { num: parseFloat(number), title: title, selected: selected };
        this.selected = selected;
    }

    toggleSelection = function(evt) {
        // console.log('toggleSelection', evt, this.data.num, this.selected, this.data.num <= evt.detail);
        this.selected = this.data.num <= evt.detail;
    }

    onmount() {
        document.addEventListener('changeStep', this.toggleSelection.bind(this));
        // document.addEventListener('changeStep', function(evt) {
        //     console.log('onmount::changeStep,', evt, abc);
        // });
        // console.log("mounted Hello");
    }
    onremount() {
        // console.log("remounted Hello");
    }
    onunmount() {
        document.removeEventListener('changeStep', this.toggleSelection);
    }

    update(data, index) {

        this.data = data;
        this.title.textContent = data.title;
        this.num.textContent = data.num;

    }

    set selected(what) {
        this.data.selected = what;
        what && this.el.classList.add('selected');
        !what && this.el.classList.remove('selected');

    }
    get selected() {
        return this.data.selected;
    }

}

class WindowPrompt {
    /**
     * 
     * @param {string} title : titolo finestra; 
     * @param {*} placeholder : testo nella textbox;
     * @param {*} context : portlet chiamante;
     */
    constructor(id, title, ph_text, btnContext) {
        this.el = el('.windowPrompt',
            this.window = el('.window#' + id,
                this.title = el('h3', { textContent: title }),
                this.textarea = new InputTextArea('wTextarea', { class: 'form-control', placeholder: ph_text || 'La richiesta viene rifiutata per...' }),
                // this.btnBack = new Button({ id: 'btnBack', caption: 'Annulla', context: btnContext, onClick: 'handleBack' }),
                // this.btnConfirm = new Button({ id: 'btnConfirm', caption: 'Invia', context: btnContext, onClick: 'handleConfirm' }),
                this.bottomBar = el('.bottom.bar',
                    this.options = new ButtonToolbar(id + '_btns', [
                        [{ id: 'btnKo', caption: 'Annulla', class: 'btn btn-danger', onclick: 'handleBack' }],
                        [{ id: 'btnOk', caption: 'Invia', class: 'btn btn-primary', context: this, onclick: 'handleConfirm' }],
                    ], { context: this, groupClass: 'btn-group-sm ml-1', toolbarClass: 'justify-content-between' }),
                )
            ),
            this.cover = el('.background'),

        );

        this.cover.onclick = this.handleBack;
    }
    handleConfirm() {
        // alert('OK!');
        const event = new CustomEvent("confirm_window", { detail: this.textarea.value });
        document.dispatchEvent(event);
    }
    handleBack() {
        // alert('KO!');
        const event = new CustomEvent("close_window");
        document.dispatchEvent(event);
    }
}

/**
 * Funcs JS per Portlets/Tema IS (Appointer)
 * @author Infoservice srl www.infoservicenet.it (Daniele)
 * @version 2020 
 * @since 1.0;
 */

/**
 * Aggiunge gli ultimi clienti visitati ad un elenco;
 * Restituisce l'elenco corrente;
 * @param {id cliente} customerId 
 */
function addToLastOpened(customerId) {

    let lastOpened;
    // debugger;
    try {
        lastOpened = JSON.parse(getCookie('lastOpenedCustomers'));
    } catch (e) {}
    if (customerId) {
        if (!lastOpened) lastOpened = [];
        lastOpened.push(customerId);
        lastOpened = [...new Set(lastOpened)]; // Remove Duplicates;
        // console.log('lastOpened > ', lastOpened);
        setCookie('lastOpenedCustomers', JSON.stringify(lastOpened), 30);
    }

    return lastOpened ? lastOpened.join() : '';

}

/**
 * Aggiunge gli ultimi files aperti ad un elenco;
 * Restituisce l'elenco corrente;
 * @param {id cliente} fileId 
 */
function addToLastFiles(fileId) {

    let lastFiles;
    // debugger;
    try {
        lastFiles = JSON.parse(getCookie('lastFiles'));
    } catch (e) {}
    if (fileId) {
        if (!lastFiles) lastFiles = [];
        lastFiles.push(fileId);
        lastFiles = [...new Set(lastFiles)]; // Remove Duplicates;
        // console.log('lastFiles > ', lastFiles);
        setCookie('lastFiles', JSON.stringify(lastFiles), 30);
    }

    return lastFiles ? lastFiles.join() : '';

}

// function setAttribFields(dataObj, domObj, domDestination) {

//     /**
//      * Dato un oggetto ATTRIBUTI derivato dal portlet crea i campi
//      * Dipendenze:
//      *  - reDom;
//      * @author Infoservice srl www.infoservicenet.it (Daniele)
//      * @version 2020 
//      * @since 1.0;
//      */

//     if (!domObj.dataFields) domObj.dataFields = {};
//     if (domObj.dataFields) {

//         for (let attribId in domObj.dataFields) {
//             console.log('già esistono', attribId, domObj.dataFields[attribId]);
//             unmount(domDestination, domObj.dataFields[attribId]);
//             domObj.dataFields[attribId] = null;
//         }
//     }

//     for (let attribId in dataObj) {
//         //if (1 == 1) console.log(attribId, " = ", dataObj[attribId]);

//         let a = dataObj[attribId],
//             r = a[0];
//         let iType = 'text';
//         if (r.ATTPVALUE == 'N') iType = 'number';
//         if (r.ATTPVALUE == 'D') iType = 'date';
//         if (r.CDHTMTYP.length > 0) iType = r.CDHTMTYP;
//         if (!r.AVVALATT) r.AVVALATT = '';

//         switch (r.ATTYPE) {
//             case 'L':
//                 if (iType == 'textarea') {
//                     domObj.dataFields[attribId] = new InputTextArea(attribId, { type: iType, class: 'form-control', label: r.CDHTMLBL || r.ATDESCRI, rel: r.CDATTRIB, placeholder: r.CDHTMPLA, containerClass: 'col col-12 ' + r.CDHTMCSS, value: r.AVVALATT });
//                 } else {
//                     domObj.dataFields[attribId] = new Input(attribId, { type: iType, class: 'form-control', label: r.CDHTMLBL || r.ATDESCRI, rel: r.CDATTRIB, placeholder: r.CDHTMPLA, containerClass: 'col col-12 ' + r.CDHTMCSS, value: r.AVVALATT });
//                 }
//                 mount(domDestination, domObj.dataFields[attribId]);
//                 break;

//             case 'F':

//                 if (domObj.dataFields[attribId]) continue;
//                 let options = [],
//                     num = 0;
//                 while (num < a.length) {
//                     options.push({ value: a[num].ATVALUEC });
//                     num++;
//                 }

//                 domObj.dataFields[attribId] = new InputSelect(attribId, { class: 'form-control', label: r.CDHTMLBL || r.ATDESCRI, rel: r.CDATTRIB, containerClass: 'col col-12 ' + r.CDHTMCSS, value: r.AVVALATT }, options);
//                 mount(domDestination, domObj.dataFields[attribId]);
//                 break;

//             default:
//                 break;
//         }
//     }
//     //console.log('setAttribFields', domObj);
// }
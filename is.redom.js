/**
 * Funcs JS per Portlets/Tema IS (Appointer)
 * @author Infoservice srl www.infoservicenet.it (Daniele)
 * @version 2020 
 * @since 1.0;
 */

const { el, list, mount, unmount } = redom; // if use redom;

/** Una serie di funzioni di Utility, legate a RE:DOM e generali */

/**
 * Utility per effettuare il mount su N argomenti
 * @constructor
 * @param {Array} a - L'array di elementi su cui effettuare il mount. Il primo è la radice;
 */
function mounts(a) { // Utility per REDOM::mount;

    let i = 1;
    for (i; i < arguments.length; i++) {
        // console.log(i, arguments.length, arguments[i]);
        mount(arguments[0], arguments[i]);
    }
}

function KeysToUpperCase(obj) { // Utility per Postgres;

    /**
     * Dato un oggetto con chiavi definite in lowercase (come le colonne restituite dal Postgres)
     * mappo l'oggetto e ne ricreo uno nuovo con chiavi in UpperCase;
     * il ciclo While e la n desc sono sistemi per incrementare l'efficienza del ciclo;
     */

    let key, keys = Object.keys(obj);
    let n = keys.length;
    let newobj = {}
    while (n--) {
        key = keys[n];
        newobj[key.toUpperCase()] = obj[key];
    }
    return newobj;
    // for (let [key, value] of Object.entries(object1)) {
    //     console.log(`${key}: ${value}`);
    // }
}

function setCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    } else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// 
//Componenti JS REDOM per libreria std Sitepainter 
//(c) 2020 Infoservice srl www.infoservicenet.it
//by Daniele Massi
//

class Avatar {
    constructor(id = '') {
        this.el = el('.avatar' + (id ? '#' + id : ''),
            el('.user.image',
                this.image = new ImageEl('../is/images/is-avatar.png'),
                this.words = el('.user.words'),
            ),
            el('.user.txt',
                this.label = el('.user.label'),
                this.subtitle = el('.user.subtitle'),
            )
        );

        this.data = {};
        this.el.onclick = evt => {
            const event = new CustomEvent("clickavatar", { detail: this.data });
            document.dispatchEvent(event);
        }
    }

    get name() {
        return this.label.textContent;
    }

    set name(txt) {
        this.label.textContent = txt;
        let i = 0,
            l = txt.split(' '),
            w = '';
        while (i < Math.min(l.length, 2)) {
            w += l[i].charAt(0);
            i++;
        }
        this.words.textContent = w.toUpperCase();
    }

    get surname() {
        return this.subtitle.textContent;
    }

    set surname(txt) {
        this.subtitle.textContent = txt;
    }

    get icon() {
        return this.image.src;
    }

    set icon(src) {
        this.image.update(src);
    }
}

class Button {

    constructor(data, parent = null) {
        this.el = el('button', { type: 'button' },
            this.sp_icon = el('span.icon'),
            this.sp_text = el('span.text'));
        this.parent = parent || data.parent || data.context;
        this.el.onclick = evt => {
            const event = new CustomEvent("onclick", { detail: this.el.value });
            document.dispatchEvent(event);
        }

        if (data) this.update(data);

    }

    update(data, index, items, context) {

        // console.log('update', data, index, items, context);
        this.el.id = data.id;
        this.el.name = data.name || data.id;
        this.sp_text.textContent = data.caption;
        this.el.classList = data.class;
        this.data = data; // da definire ? 
        //this.value = data.function;

        if (context) this.parent = context;

        if (data.onclick) {
            this.el.onclick = evt => {
                this.parent[data.onclick](index, data, this);
            }
        }

        if (data.iconClass) {
            this.sp_icon.classList.add('fas', data.iconClass);
        }

    }

    set disabled(what) {
        this.el.disabled = what;
    }
}

class ButtonGroup {
    /**
     * 
     * Esempio JS:
     * dom.segment = new ButtonGroup('segment',[{caption:'Lista',class:'btn btn-outline-secondary',onclick:'showPage'},{caption:'Calendario',class:'btn btn-outline-secondary',onclick:'showPage'}],{context:me}),     * 
     * 
     * 
     * @param {*} groupId 
     * @param {*} btns 
     * @param {*} props 
     */
    constructor(groupId, btns, props) {

        // Props;
        if (!props) props = {};
        if (!props.context) props.context = '';
        if (!props.groupClass) props.groupClass = '';

        this.props = props;

        this.el = el('#' + groupId + '.btn-group', { role: 'group', 'aria-label': 'Basic Example', class: props.groupClass });
        this.ul = list(this.el, Button);
        this.btns = btns;
        this.update(btns, this.props.context);
    }

    update(data, context) {
        this.ul.update(data, context);
    }

}

/**
 * 
 * Button Toolbar. 
 * Accetta ButtonGroups e InputGroups.
 * Example syntax: new ButtonToolbar('toolbar',[cust_views,cust_primary],{context:me,toolbarClass:'col col-12 justify-content-between mb-2',groupClass:'btn-group-sm'}) 
 * 
 */
class ButtonToolbar {

    constructor(toolbarId, btnGroups, props) {

        // Props;
        if (!props) props = {};
        if (!props.context) props.context = '';
        if (!props.toolbarClass) props.toolbarClass = '';
        if (!props.groupClass) props.groupClass = '';

        this.props = props;
        this.btnGroups = btnGroups;
        this.ul = [];

        for (let i = 0; i < btnGroups.length; i++) {
            // console.log(i, btnGroups[i], typeof btnGroups[i], typeof btnGroups[i] == 'object', typeof btnGroups[i].type);
            if (btnGroups[i].type) {
                this.ul.push(new InputGroup('igroup_' + i, btnGroups[i].childs, this.props));
            } else {
                this.ul.push(new ButtonGroup('group_' + i, btnGroups[i], this.props));
            }
        }
        this.el = el('#' + toolbarId + '.btn-toolbar', { role: 'toolbar', 'aria-label': 'Toolbar', class: props.toolbarClass },
            this.ul);

    }
}

class ImageEl {
    constructor(path) {
        this.el = el("img", { src: path });
        this.data = {};
    }
    update(data) {
        console.log('ImageEl::data', data)
        const { url } = data;

        if (url !== this.data.url) {
            this.el.src = url;
        }

        this.data = data;
    }

    get src() {
        return this.el.src;
    }

    set src(path) {
        this.el.src = path;
    }
}

class Input {
    /* 
Input Form ~ Base
Todo: Binding su Portlet
*/
    constructor(inputId, props) {

        // Props;
        if (!props) props = {};
        if (!props.label) props.label = '';
        if (!props.labelClass) props.labelClass = '';
        if (!props.name) props.name = inputId;
        if (!props.type) props.type = 'text';
        if (!props.placeholder) props.placeholder = props.label;
        if (!props.containerClass) props.containerClass = '';

        this.id = inputId;
        this.data = props;
        this.modified = false;

        //
        // Element;

        this.el = el('.form-group', { class: props.containerClass },
            this.label = el('label', { textContent: props.label, for: inputId, class: props.labelClass }),
            this.input = el('input#' + inputId + '.form-control', props));

        this.input.onfocus = evt => {
            const event = new CustomEvent("inputfocus", { detail: { el: this.el, obj: this, data: this.data } });
            document.dispatchEvent(event);
        }

        this.input.onblur = evt => {
            const event = new CustomEvent("inputblur", { detail: { el: this.el, obj: this, data: this.data } });
            document.dispatchEvent(event);
        }
        this.input.onchange = evt => {
            this.modified = true;
            const event = new CustomEvent("inputchange", { detail: { el: this.el, obj: this, data: this.data } }); // old:  {detail: this.input.value}
            document.dispatchEvent(event);
        }
        this.input.onclick = evt => {
            const event = new CustomEvent("inputclick", { detail: this.input.value });
            document.dispatchEvent(event);
        }
        this.input.onkeyup = evt => {
            this.modified = true;
            const event = new CustomEvent("inputkeyup", { detail: { el: this.el, obj: this, data: this.data } });
            document.dispatchEvent(event);
        }
        this.input.onkeypress = evt => {
            if (evt.charCode === 13) {
                const event = new CustomEvent(this.input.id + "_send", { detail: this.input.value });
                document.dispatchEvent(event);
            }
        }

        // Compatibilità con CtrlInput Zucchetti
        // LinkZoom Zucchetti 

        if (props.linkZoom && props.linkRoot && !props.readonly) {
            this.btn = [];

            this.btn = el('button#' + inputId + '_zoom.btn-zoom.btn.btn-outline-secondary', { textContent: 'Seleziona' });
            this.btn.onclick = evt => {

                this.data.linkRoot[this.data.linkZoom].link_id_hash = 'INFOSERVICE';
                this.data.linkRoot[this.data.linkZoom].intovarsType = 'C,C';
                this.data.linkRoot[this.data.linkZoom].linkedFieldCtrl = this;
                this.data.linkRoot[this.data.linkZoom].OpenZoom();
            }
            mount(this.el, this.btn);
        }

    }

    get disabled() {
        return this.input.disabled;
    }
    set disabled(b) {
        this.input.disabled = b;
    }

    get placeholder() {
        return this.input.placeholder;
    }
    set placeholder(b) {
        this.input.placeholder = b;
    }

    get value() {
        return this.Value();
    }
    set value(val) {
        this.Set(val);
    }
    Value(val) {
        if (val) this.input.value = val;
        return this.input.value;
    }
    Set(val) {
        this.Value(val);
    }

    get Ctrl_input() { // Compatibilità con CtrlInput Zucchetti
        return this.input;
    }

    launchEvents(old_value) { // Compatibilità con CtrlInput Zucchetti
        this.data.linkRoot[this.data.linkZoom].DoLink();
    }

}

class InputCheck extends Input {

    constructor(inputId, props) {

        props.type = 'checkbox';
        super(inputId, props);

        if (!props.labelPosition) props.labelPosition = 'before';

        this.el = el('.form-group', { class: props.containerClass },
            this.label = el('label', { textContent: props.label }),
            this.input = el('input#' + inputId + '.form-control.checkbox', props),
            this.lbchk = el('label.check', { for: inputId, textContent: 'Toggle' }));

        this.input.onchange = evt => {
            this.modified = true;
            //const event = new CustomEvent(this.input.id + "_change", { detail: { el: this.el, obj: this, data: this.data } });
            const event = new CustomEvent("inputchange", { detail: { el: this.el, obj: this, data: this.data } });
            document.dispatchEvent(event);
        }

    }

    update(data, index, items, context) {
        console.log('InputCheck:update', data, index, items, context);
        this.context = context;
        context = context.data;
        this.el.classList.add(context.class);
        this.id = context.id + index;
        this.label.setAttribute("for", this.id);
        this.lbchk.setAttribute("for", this.id);
        this.label.textContent = data.textContent || data.text || data.caption || data.value;
        this.input.value = data.value;
        this.input.name = context.id;
        this.input.id = this.id;

        if (data.selected) this.input.checked = true;
        if (context.value == this.input.value) this.input.checked = true;

    }

    get checked() {
        return this.input.checked;
    }
    set checked(b) {
        this.input.checked = b;
    }
}

class InputCheckList extends Input {
    /* 
    Input Check / List Group
    Options syntax: [{value:'value',textContent:'label',[selected]},...]
    TODO: UPDATE;
    */
    /**
     * 
     * 
     * Syntax example: 
     * taskStates:[{value:'B',text:'Bozza',containerClass:'col-inline'},
               {value:'P',text:'Provvisorio',containerClass:'col-inline'},
               {value:'C',text:'Confermato',containerClass:'col-inline'},
               {value:'A',text:'Annullato',containerClass:'col-inline'}],
     * dom.calendars = new InputCheckList('CALS',{label:'Calendari',...},taskStates),
     * 
     * 
     * @param {*} inputId 
     * @param {*} props 
     * @param {*} opts 
     */
    constructor(inputId, props, opts) {

        super(inputId, props);
        delete props.type;
        this.el = el('.form-group', { class: props.containerClass },
            this.label = el('label', { textContent: props.label, class: props.labelClass }),
            this.input = el('#' + inputId + '.check-group'),
        );
        this.data = { id: inputId, ...props }
        this.options = list(this.input, InputCheck);
        this.update(opts, this.dati);

    }

    update(dati) {
        this.options.update(dati, this);
    }

    Value(val) { // Overwrite di Input::Value;
        if (val) this._value = val;
        return this._value;
    }

}

class InputTextArea extends Input {
    constructor(inputId, props) {

        super(inputId, props);
        delete props.type;
        this.el = el('.form-group', { class: props.containerClass },
            this.label = el('label', { textContent: props.label, for: inputId, class: props.labelClass }),
            this.input = el('textarea#' + inputId + '.form-control', props),
        );

        this.input.onchange = evt => {
            this.modified = true;
            const event = new CustomEvent("inputchange", { detail: { el: this.el, obj: this, data: this.data } });
            document.dispatchEvent(event);
        }

    }
}


class InputRadio extends Input {
    /* 
    Input Radio / Radio Group
    Options syntax: [{value:'value',textContent:'label',[selected]},...]
    TODO: UPDATE;
    */
    constructor(inputId, props, opts) {

        super(inputId, props);
        delete props.type;
        this.el = el('.form-group', { class: props.containerClass },
            this.label = el('label', { textContent: props.label, class: props.labelClass }),
            this.input = el('#' + inputId + '.radio-group'),
        );
        this.data = { id: inputId, ...props }
        this.options = list(this.input, __InputRadioOption);
        this.update(opts, this.dati);

    }

    update(dati) {
        this.options.update(dati, this);
    }

    Value(val) { // Overwrite di Input::Value;
        if (val) this._value = val;
        return this._value;
    }

}

class __InputRadioOption {
    constructor() {
        this.el = el('.form-check',
            this.input = el('input', { type: 'radio', class: 'form-check-input' }),
            this.label = el('label', { class: 'form-check-label' }),
        );
        this.input.onchange = evt => {
            this.context.modified = true;
            this.context.Value(this.input.value);
            const event = new CustomEvent(this.input.name + "_change", { detail: { el: this.el, obj: this, value: this.input.value } });
            // const event = new CustomEvent("inputchange", { detail: { el: this.el, obj: this, data: this.data } });
            document.dispatchEvent(event);
        }
    }
    update(data, index, items, context) {

        this.context = context;
        context = context.data;
        this.el.classList.add(context.class);
        this.label.setAttribute("for", context.id + index);
        this.label.textContent = data.textContent || data.text || data.caption || data.value;
        this.input.value = data.value;
        this.input.name = context.id;
        this.input.id = context.id + index;
        if (data.selected) this.input.checked = true;
        if (context.value == this.input.value) this.input.checked = true;

    }
}

class InputSelect extends Input {
    /* 
    Input Select / Combo
    Options syntax: [{value:'value',textContent:'label',[selected]},...]
    TODO: UPDATE;
    */
    constructor(inputId, props, opts) {

        super(inputId, props);
        delete props.type;
        this.el = el('.form-group', { class: props.containerClass },
            this.label = el('label', { textContent: props.label, for: inputId, class: props.labelClass }),
            this.input = el('select#' + inputId + '.form-control', props),
        );
        this.options = list(this.input, __InputSelectOption);
        this.update(opts);
        /*
        Qui va rispecificato, perchè il value non esiste ancora al primo assegnamento
        */
        if (props.value) this.input.value = props.value;

        this.input.onchange = evt => {
            this.modified = true;
            const event = new CustomEvent(this.input.id + "_change", { detail: { el: this.el, obj: this, data: this.data } });
            // const event = new CustomEvent("inputchange", { detail: { el: this.el, obj: this, data: this.data } });
            document.dispatchEvent(event);
        }
    }

    update(dati) {
        this.options.update(dati);
    }

}

class __InputSelectOption {
    /* 
    Input Select Option / Combo Option
    Per uso interno della classe InputSelect
    */
    constructor() {
        this.el = el('option');
    }
    update(data, index, items, context) {

        this.el.value = data.value;
        this.el.textContent = data.textContent || data.text || data.caption || data.value;
        if (data.selected) this.el.selected = data.selected;

    }
}

class InputGroup {
    /* 
    Input Group
    TODO: !!! NON FINITA, NON USARE !!!
    */

    constructor(groupId, els, props) {

        // Props;
        if (!props) props = {};
        if (!props.context) props.context = '';
        if (!props.groupClass) props.groupClass = '';

        this.props = props;

        this.el = el('#' + groupId + '.input-group', { role: 'group', class: props.groupClass });
        this.ul = list(this.el, Input);
        this.btns = els;
        this.update(els, this.props.context);
    }

    update(data, context) {
        this.ul.update(data, context);
    }

    // <div class="input-group mb-3">
    //   <input type="text" class="form-control" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="button-addon2">
    //   <div class="input-group-append">
    //     <button class="btn btn-outline-secondary" type="button" id="button-addon2">Button</button>
    //   </div>
    // </div>

}


class MenuLi {
    /* 
Menu List Item ~ Base
Usato in:
    - istpl_header;
    - istpl_sidemenu;
*/
    constructor() {
        this.data = null;
        this.image = null,
            this.el = el('li.item',
                this.a = el('a', { href: 'javascript:void(0)' },
                    this.sp_icon = el('span.icon'),
                    this.text = el('span.text')
                )
            );
        this.a.onclick = evt => {
            const event = new CustomEvent("clickmenu", { detail: this.data });
            document.dispatchEvent(event);
        }
    }
    update(data, index, items, context) {

        this.data = data;
        this.text.textContent = data.caption;
        this.el.id = 'li_' + data.id;
        this.a.id = 'a_' + data.id;
        if (!data.hasChild) {
            //       this.a.setAttribute('href','javascript:');
            // //     	this.a.setAttribute('target',data.target);
            //     } else {
            this.a.setAttribute('href', data.link);
            this.a.setAttribute('target', data.target);
        } else {
            this.el.classList.add('has-child');
        }
        if (data.icon) {
            this.image = new ImageEl(data.icon);
            mount(this.sp_icon, this.image);
        }
        if (data.iconClass) {
            // console.log('iconClass', data.iconClass.split(' '));
            const iconClasses = data.iconClass.split(' ');
            for (let i = 0; i < iconClasses.length; i++) {
                this.sp_icon.classList.add(iconClasses[i]);
            }

        }
        if (data.iconText) {
            this.iconText = el('.words', { textContent: data.iconText });
            mount(this.sp_icon, this.iconText);

        }

    }

    get icon() {
        if (this.data.icon) return this.image.src
        else return '';
    }

    set icon(src) {
        this.image.update(src);
    }
}

class SearchForm {
    /*
    SearchForm
    TODO: correggere, 1a ver. classi;
    */
    constructor(inputId = '', props = null) {
        this.el = el('.search-form.input-group' + (inputId ? '#' + inputId : ''),
            // el('.input-group-prepend',
            //     this.del = new Button({ id: 'btn-cancel', value: 'reset', class: 'btn btn-primary hidden', iconClass: 'fa-backspace', caption: '' }),
            // ),
            this.input = el('input', { type: 'text', class: 'form-control', placeholder: 'Cerca...' }),
            el('.input-group-append',
                this.del = new Button({ id: 'btn-cancel', value: 'reset', class: 'btn btn-primary hidden', iconClass: 'fa-backspace', caption: '' }),
                this.btn = new Button({ id: 'btn-search', value: 'send', class: 'btn btn-primary', iconClass: 'fa-search', caption: '' })
            )
        );
        this.btn.onclick = evt => {
            const event = new CustomEvent("search", { detail: this.input.value });
            document.dispatchEvent(event);
        }
        this.del.el.onclick = evt => {
            this.input.value = '';
            this.del.el.classList.add('hidden');
            const event = new CustomEvent("search", { detail: this.input.value });
            document.dispatchEvent(event);
        }

        this.input.onkeypress = evt => {

            if (this.input.value.length) {
                this.del.el.classList.remove('hidden');
            } else {
                this.del.el.classList.add('hidden');
            }
            if (evt.charCode === 13) {
                const event = new CustomEvent("search", { detail: this.input.value });
                document.dispatchEvent(event);
            }

        };

        if (!props) props = {};
        if (props.containerClass) this.el.classList.add(props.containerClass);

    }

    get placeholder() {
        return this.input.getAttribute('placeholder');
    }

    set placeholder(txt) {
        this.input.setAttribute('placeholder', txt);
    }
}

class ListEmpty {
    /**
     * Empty List;
     * @param {string} id = ID elemento 
     * @param {*} txt 
     */
    constructor(id = '', txt = 'Nessun risultato') {
        this.el = el('.list.empty' + (id.length ? '#' + id : ''), { textContent: txt });
    }

}

class LoaderTimer {
    /*
    Preloader con Timer
    1st test REDOM;
    */
    constructor() {
        this.el = el(".loader", 'loading');
        this.seconds = 0;
        this.timer = null;
    }
    onmount() {
        this.seconds = 0;
        this.timer = setInterval(this.count, 100, this);
    }
    onremount() {
        this.seconds = 0;
    }
    onunmount() {
        clearInterval(this.timer);
    }
    count(classInstance) {

        classInstance.seconds += .1;
        classInstance.el.textContent = 'Caricamento... ' + classInstance.seconds.toFixed(1);

    }
    stopCount() {
        clearInterval(this.timer);
    }
    update(text) {
        this.el.textContent = text;
    }

}

// class Rulers {

//     constructor(w, h, size) {
//         this.x = 0;
//         this.y = 0;
//         this.i = 0;
//         this.el = el('#rulers', { style: 'position:fixed; z-index:-1; top:0; left:0; width:' + w + 'px; height:' + h + 'px;' }, );
//         for (let i = 0, sz = 0; sz < w; i++, sz = size * i) {
//             //sz = size * i;
//             let dot = el('.dot', { style: 'position:absolute; top:0; left:' + sz + 'px; border-left:1px solid #000; border-top:1px solid #000; font-size:.65rem', textContent: sz });
//             mount(this.el, dot);
//             console.log('count', sz);
//         }

//         for (let k = 0, sz = 0; sz < h; k++, sz = size * k) {
//             let dot = el('.dot', { style: 'position:absolute; top:' + sz + 'px; left:0px; border-left:1px solid #000; border-top:1px solid #000; font-size:.65rem', textContent: sz + 'y' });
//             mount(this.el, dot);
//             console.log('count', sz);
//         }
//     }

// }
"use strict";
class ClassModel {
    constructor(dataModel) {
        this.id = dataModel.id;
        this.name = dataModel.name;
    }
}
class StudentModel {
    constructor(DataModel) {
        this.id = DataModel.id;
        this.name = DataModel.name;
        this.avgMark = DataModel.avgMark;
        this.sex = DataModel.sex;
    }
}
class DataHandle {
    constructor(keyData, idTbody, idForm, queryboxInputs, idDelete, idUpdate, idBtnTab, idBtnAdd, idBtnSave) {
        this.keyData = keyData;
        this.idTbody = idTbody;
        this.idForm = idForm;
        this.queryboxInputs = queryboxInputs;
        this.idDelete = idDelete;
        this.idUpdate = idUpdate;
        this.idBtnTab = idBtnTab;
        this.idBtnAdd = idBtnAdd;
        this.idBtnSave = idBtnSave;
    }
}
class Services {
    constructor(data) {
        var _a;
        this.listKeys = ["id", "name", "avgMark", "sex"];
        this.checkBtn = true;
        this.data = data;
        this.listDatas = (_a = JSON.parse(localStorage.getItem(this.data.keyData))) !== null && _a !== void 0 ? _a : [];
    }
    create() {
        const formElem = document.getElementById(this.data.idForm);
        formElem.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.checkBtn) {
                const boxInputs = document.querySelectorAll(this.data.queryboxInputs);
                const checkTf = [...boxInputs].filter((item) => {
                    const input = item;
                    if (input.value.trim() == '')
                        input.style.border = '1px solid red';
                    return input.value.trim() !== '';
                });
                let checks = this.listDatas.some((item) => {
                    const inputID = boxInputs[0];
                    if (item.id === inputID.value.trim())
                        inputID.style.border = '1px solid red';
                    return item.id === inputID.value.trim();
                });
                if (this.data.keyData === 'listClass') {
                    checks = checks ? checks : this.listDatas.some((item) => {
                        const inputClass = boxInputs[1];
                        if (item.name === inputClass.value.trim())
                            inputClass.style.border = '1px solid red';
                        return item.name === inputClass.value.trim();
                    });
                }
                if (checkTf.length === boxInputs.length && !checks) {
                    let newElem;
                    let dataJson = '';
                    let _dataJson = '';
                    if (this.data.keyData === 'listStudent') {
                        const boxRadios = document.querySelectorAll('#box-radio .form-group input');
                        const sexInput = [...boxRadios].find((item) => {
                            return item.checked;
                        });
                        dataJson += `,"sex":"${sexInput.value}"`;
                    }
                    ;
                    _dataJson = [...boxInputs].reduce((ist, item, index) => {
                        const inputElem = item;
                        return ist + `"${this.listKeys[index]}":"${inputElem.value}",`;
                    }, '').slice(0, -1);
                    const dataJs = JSON.parse('{' + _dataJson + dataJson + '}');
                    if (this.data.keyData === 'listClass')
                        newElem = new ClassModel(dataJs);
                    else
                        newElem = new StudentModel(dataJs);
                    this.listDatas.push(newElem);
                    localStorage.setItem(this.data.keyData, JSON.stringify(this.listDatas));
                    this.read();
                    [...boxInputs].forEach((item) => { item.value = ''; });
                    if (this.data.keyData === 'listStudent')
                        document.getElementById('male').checked = true;
                }
                [...boxInputs].forEach((item) => {
                    const input = item;
                    input.oninput = () => {
                        input.style.border = '1px solid grey';
                    };
                });
                // this.checkBtn = false;
            }
            return false;
        });
    }
    read() {
        const tbodyElem = document.getElementById(this.data.idTbody);
        let html = this.listDatas.map((item, index) => {
            return `<tr>
        <td>${index + 1}</td>
        <td>${item.id}</td>
        <td>${item.name}</td>
        ${this.data.keyData === 'listStudent' ? `
        <td>${item.sex}</td>
        <td>${item.avgMark}</td>` : ''}
        <td class="text-center">
          <button type="button" 
            id="delete-${this.data.keyData === 'listStudent' ? 'student' : 'class'}_${index}" 
            class="btn btn-danger" onclick="handleDelete(this)"
          >Xóa</button>
        </td>
        <td class="text-center">
          <button type="button" 
            id="update-${this.data.keyData === 'listStudent' ? 'student' : 'class'}_${index}" 
            class="btn btn-info" onclick="handleUpdate(this)"
          >Edit</button>
        </td>
      </tr>`;
        }).join('');
        tbodyElem.innerHTML = html;
    }
    delete(id) {
        this.listDatas.splice(Number(id.replace(this.data.idDelete, '')), 1);
        localStorage.setItem(this.data.keyData, JSON.stringify(this.listDatas));
        this.read();
    }
    find() {
        var _a;
        this.listDatas = (_a = JSON.parse(localStorage.getItem(this.data.keyData))) !== null && _a !== void 0 ? _a : [];
        const searchInput = document.getElementById('input-search');
        const element = this.listDatas.find((item) => {
            return item.id === searchInput.value;
        });
        if (element) {
            this.listDatas = [element];
            this.read();
        }
        else {
            const tbodyElem = document.getElementById(this.data.idTbody);
            tbodyElem.innerHTML = `<p class="w-100 text-danger">Không tìm thấy!</p>`;
        }
        searchInput.value = '';
    }
    default() {
        const btnTab = document.getElementById(this.data.idBtnTab);
        const saveLists = this.listDatas;
        btnTab.onclick = () => {
            this.listDatas = saveLists;
            this.read();
        };
    }
    update(id) {
        const formElem = document.getElementById(this.data.idForm);
        const boxRadios = document.querySelectorAll('#box-radio .form-group input');
        const index = Number(id.replace(this.data.idUpdate, ''));
        const dataElem = this.listDatas[index];
        const boxInputs = document.querySelectorAll(this.data.queryboxInputs);
        let dataJson = JSON.stringify(dataElem).replace('{', '[').replace('}', ']');
        this.listKeys.forEach((item, index) => {
            dataJson = dataJson.replace(`"${item}":`, '');
        });
        const dataJs = JSON.parse(dataJson);
        [...boxInputs].forEach((item, index) => {
            const inputElem = item;
            inputElem.value = dataJs[index];
        });
        if (this.data.keyData === 'listStudent') {
            const sexInput = [...boxRadios].find((item) => {
                return item.value === dataElem.sex;
            });
            sexInput.checked = true;
        }
        boxInputs[0].focus();
        formElem.onsubmit = (e) => {
            e.preventDefault();
            if (!this.checkBtn) {
                const checkTf = [...boxInputs].filter((item) => {
                    const input = item;
                    if (input.value.trim() == '')
                        input.style.border = '1px solid red';
                    return input.value.trim() !== '';
                });
                let checks = this.listDatas.some((item) => {
                    const inputID = boxInputs[0];
                    if (item.id === inputID.value.trim() && item !== dataElem)
                        inputID.style.border = '1px solid red';
                    return item.id === inputID.value.trim() && item !== dataElem;
                });
                if (this.data.keyData === 'listClass') {
                    checks = checks ? checks : this.listDatas.some((item) => {
                        const inputClass = boxInputs[1];
                        if (item.name === inputClass.value.trim() && item !== dataElem)
                            inputClass.style.border = '1px solid red';
                        return item.name === inputClass.value.trim() && item !== dataElem;
                    });
                }
                if (checkTf.length === boxInputs.length && !checks) {
                    let dataJn = '';
                    let _dataJson = '';
                    if (this.data.keyData === 'listStudent') {
                        const sexInput = [...boxRadios].find((item) => {
                            return item.checked;
                        });
                        dataJn += `,"sex":"${sexInput.value}"`;
                    }
                    ;
                    _dataJson = [...boxInputs].reduce((ist, item, index) => {
                        const inputELem = item;
                        return ist + `"${this.listKeys[index]}":"${inputELem.value.trim()}",`;
                    }, '').slice(0, -1);
                    const newData = JSON.parse('{' + _dataJson + dataJn + '}');
                    if (this.listDatas[index]) {
                        this.listDatas[index] = newData;
                        localStorage.setItem(this.data.keyData, JSON.stringify(this.listDatas));
                        this.read();
                        [...boxInputs].forEach((item) => { item.value = ''; });
                        if (this.data.keyData === 'listStudent')
                            document.getElementById('male').checked = true;
                    }
                    [...boxInputs].forEach((item) => {
                        const input = item;
                        input.style.border = '1px solid grey';
                    });
                }
                [...boxInputs].forEach((item) => {
                    const input = item;
                    input.oninput = () => {
                        input.style.border = '1px solid grey';
                    };
                });
                this.checkBtn = true;
            }
            return false;
        };
    }
    check() {
        const btnAdd = document.getElementById(this.data.idBtnAdd);
        const btnSave = document.getElementById(this.data.idBtnSave);
        const btnSearch = document.getElementById('btnSearch');
        const btnTab = document.getElementById(this.data.idBtnTab);
        btnAdd.onclick = () => {
            this.checkBtn = true;
        };
        btnSave.onclick = () => {
            this.checkBtn = false;
        };
        btnTab.addEventListener('click', () => {
            if (this.data.keyData === 'listClass') {
                btnSearch.classList.remove('student');
                btnSearch.classList.add('class');
            }
            else {
                btnSearch.classList.add('student');
                btnSearch.classList.remove('class');
            }
        });
    }
}
const dataClass = new DataHandle('listClass', 'tbodyClass', 'form-class', '#form-class>.form-group>input', 'delete-class_', 'update-class_', 'nav-class-tab', 'btnAddClass', 'btnSaveClass');
const dataStudent = new DataHandle('listStudent', 'tbodyStudent', 'form-student', '#form-student>.form-group>input', 'delete-student_', 'update-student_', 'nav-student-tab', 'btnAddStudent', 'btnSaveStudent');
const handleDelete = (elem) => {
    elem.id.indexOf('class') !== -1 ? localClass.delete(elem.id) : localStudent.delete(elem.id);
};
const handleUpdate = (elem) => {
    elem.id.indexOf('class') !== -1 ? localClass.update(elem.id) : localStudent.update(elem.id);
};
const findDatas = (elem) => {
    if (elem.classList.toString().indexOf('class') != -1)
        localClass.find();
    else
        localStudent.find();
};
const localClass = new Services(dataClass);
const localStudent = new Services(dataStudent);
function start(data) {
    data.read();
    data.check();
    data.create();
    data.default();
}
start(localStudent);
start(localClass);

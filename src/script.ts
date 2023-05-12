type DataModel = {
  id:string,
  name:string,
  avgMark?:string,
  sex?:string
}

class ClassModel {
  private id:string;
  private name:string;
  constructor(dataModel:DataModel) {
    this.id = dataModel.id;
    this.name = dataModel.name;
  }
}

class StudentModel {
  private id:string;
  private name:string;
  private avgMark?:string;
  private sex?:string;
  constructor(DataModel:DataModel) {
    this.id = DataModel.id;
    this.name = DataModel.name;
    this.avgMark = DataModel.avgMark;
    this.sex = DataModel.sex;
  }
}

interface CRUD <Type> {
  create():void;
  read():void;
  delete(id:string):void;
  find():void;
  default():void;
  check():void;
  update(id:string):void;
}

class DataHandle {
  public keyData:string;
  public idTbody:string;
  public idForm:string;
  public queryboxInputs:string;
  public idDelete:string;
  public idUpdate:string;
  public idBtnTab:string;
  public idBtnAdd:string;
  public idBtnSave:string;
  constructor(keyData:string, idTbody:string, idForm:string, queryboxInputs:string, idDelete:string, idUpdate:string, idBtnTab:string, idBtnAdd:string, idBtnSave:string) {
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

class Services implements CRUD<any> {
  private data:DataHandle;
  private listKeys:string[] = ["id", "name", "avgMark", "sex"];
  private listDatas:Array<any>;
  private checkBtn:boolean = true;
  constructor(data:DataHandle) {
    this.data = data;
    this.listDatas = JSON.parse(localStorage.getItem(this.data.keyData) as string) ?? [];
  }
  create(): void {
    const formElem = document.getElementById(this.data.idForm) as HTMLFormElement;
    formElem.addEventListener('submit', (e):boolean=> {
      e.preventDefault();
      if(this.checkBtn) {
        const boxInputs = document.querySelectorAll(this.data.queryboxInputs) as NodeList;
        const checkTf:any = [...boxInputs].filter((item:Node):boolean=> {
          const input = item as HTMLInputElement;
          if(input.value.trim() == '') input.style.border = '1px solid red';
          return input.value.trim() !== '';
        });
        let checks:boolean = this.listDatas.some((item:any):boolean=> {
          const inputID = boxInputs[0] as HTMLInputElement;
          if(item.id === inputID.value.trim()) inputID.style.border = '1px solid red';
          return item.id === inputID.value.trim();
        });
        if(this.data.keyData === 'listClass') {
          checks = checks ? checks : this.listDatas.some((item:any):boolean=> {
            const inputClass = boxInputs[1] as HTMLInputElement;
            if(item.name === inputClass.value.trim()) inputClass.style.border = '1px solid red';
            return item.name === inputClass.value.trim();
          });
        }
        if(checkTf.length === boxInputs.length && !checks) {
          let newElem:any;
          let dataJson:string = '';
          let _dataJson:string = '';
          if(this.data.keyData === 'listStudent') {
            const boxRadios = document.querySelectorAll('#box-radio .form-group input') as NodeList;
            const sexInput = [...boxRadios].find((item:Node):boolean=> {
              return (item as HTMLInputElement).checked;
            });
            dataJson += `,"sex":"${(sexInput as HTMLInputElement).value}"`;
          };
          _dataJson = [...boxInputs].reduce((ist:string ,item:Node, index:number):string=> {
            const inputElem = item as HTMLInputElement;
            return ist + `"${this.listKeys[index]}":"${inputElem.value}",`;
          }, '').slice(0,-1);
          const dataJs:DataModel = JSON.parse('{' + _dataJson + dataJson + '}');
          if(this.data.keyData === 'listClass') newElem = new ClassModel(dataJs);
          else newElem = new StudentModel(dataJs);
          this.listDatas.push(newElem);
          localStorage.setItem(this.data.keyData, JSON.stringify(this.listDatas));
          this.read();
          [...boxInputs].forEach((item:Node):void=> {(item as HTMLInputElement).value = '';});
          if(this.data.keyData === 'listStudent') (document.getElementById('male') as HTMLInputElement).checked = true;
        }
        [...boxInputs].forEach((item:Node):void=> {
          const input = item as HTMLInputElement;
          input.oninput = ():void => {
            input.style.border = '1px solid grey';
          }
        });
        // this.checkBtn = false;
      }
      return false;
    });
  }
  read(): void {
    const tbodyElem = document.getElementById(this.data.idTbody) as HTMLElement;
    let html:string = this.listDatas.map((item:any, index:number):string=> {
      return `<tr>
        <td>${index + 1}</td>
        <td>${item.id}</td>
        <td>${item.name}</td>
        ${this.data.keyData === 'listStudent'? `
        <td>${item.sex}</td>
        <td>${item.avgMark}</td>` :''}
        <td class="text-center">
          <button type="button" 
            id="delete-${this.data.keyData === 'listStudent'? 'student':'class'}_${index}" 
            class="btn btn-danger" onclick="handleDelete(this)"
          >Xóa</button>
        </td>
        <td class="text-center">
          <button type="button" 
            id="update-${this.data.keyData === 'listStudent'? 'student':'class'}_${index}" 
            class="btn btn-info" onclick="handleUpdate(this)"
          >Edit</button>
        </td>
      </tr>`
    }).join('');
    tbodyElem.innerHTML = html;
  }
  delete(id:string): void {
    this.listDatas.splice(Number(id.replace(this.data.idDelete, '')), 1);
    localStorage.setItem(this.data.keyData, JSON.stringify(this.listDatas));
    this.read();
  }
  find(): void {
    this.listDatas = JSON.parse(localStorage.getItem(this.data.keyData) as string) ?? [];
    const searchInput = document.getElementById('input-search') as HTMLInputElement;
    const element:any = this.listDatas.find((item:any):boolean=> {
      return item.id === searchInput.value;
    });
    if(element) {
      this.listDatas = [element];
      this.read();
    } else {
      const tbodyElem = document.getElementById(this.data.idTbody) as HTMLElement;
      tbodyElem.innerHTML = `<p class="w-100 text-danger">Không tìm thấy!</p>`
    }
    searchInput.value = '';
  }
  default():void {
    const btnTab = document.getElementById(this.data.idBtnTab) as HTMLElement;
    const saveLists:Array<any> = this.listDatas;
    btnTab.onclick = ():void=> {
      this.listDatas = saveLists;
      this.read();
    }
  }
  update(id: string): void {
    const formElem = document.getElementById(this.data.idForm) as HTMLFormElement;
    const boxRadios = document.querySelectorAll('#box-radio .form-group input') as NodeList;
    const index:number = Number(id.replace(this.data.idUpdate, ''));
    const dataElem:any = this.listDatas[index];
    const boxInputs = document.querySelectorAll(this.data.queryboxInputs) as NodeList;
    let dataJson:string = JSON.stringify(dataElem).replace('{','[').replace('}',']');
    this.listKeys.forEach((item:string,index:number):void=> {
      dataJson = dataJson.replace(`"${item}":`,'');
    });
    const dataJs = JSON.parse(dataJson);
    [...boxInputs].forEach((item:Node, index:number):void=> {
      const inputElem = item as HTMLInputElement;
      inputElem.value = dataJs[index];
    });
    if(this.data.keyData === 'listStudent') {
      const sexInput = [...boxRadios].find((item:Node):boolean=> {
        return (item as HTMLInputElement).value === dataElem.sex;
      }) as HTMLInputElement;
      sexInput.checked = true;
    }
    (boxInputs[0] as HTMLInputElement).focus();
    formElem.onsubmit = (e):boolean=> {
      e.preventDefault();
      if(!this.checkBtn) {
        const checkTf:any = [...boxInputs].filter((item:Node):boolean=> {
          const input = item as HTMLInputElement;
          if(input.value.trim() == '') input.style.border = '1px solid red';
          return input.value.trim() !== '';
        });
        let checks:boolean = this.listDatas.some((item:any):boolean=> {
          const inputID = boxInputs[0] as HTMLInputElement;
          if(item.id === inputID.value.trim() && item !== dataElem) inputID.style.border = '1px solid red';
          return item.id === inputID.value.trim() && item !== dataElem;
        });
        if(this.data.keyData === 'listClass') {
          checks = checks ? checks : this.listDatas.some((item:any):boolean=> {
            const inputClass = boxInputs[1] as HTMLInputElement;
            if(item.name === inputClass.value.trim() && item !== dataElem) inputClass.style.border = '1px solid red';
            return item.name === inputClass.value.trim() && item !== dataElem;
          });
        }
        if(checkTf.length === boxInputs.length && !checks) {
          let dataJn:string = '';
          let _dataJson:string = '';
          if(this.data.keyData === 'listStudent') {
            const sexInput = [...boxRadios].find((item:Node):boolean=> {
              return (item as HTMLInputElement).checked;
            });
            dataJn += `,"sex":"${(sexInput as HTMLInputElement).value}"`;
          };
          _dataJson = [...boxInputs].reduce((ist:string, item:any, index:number):string=> {
            const inputELem = item as HTMLInputElement;
            return ist +`"${this.listKeys[index]}":"${inputELem.value.trim()}",`;
          }, '').slice(0,-1);
          const newData:DataModel = JSON.parse('{' + _dataJson + dataJn + '}')
          if(this.listDatas[index]) {
            this.listDatas[index] = newData;
            localStorage.setItem(this.data.keyData, JSON.stringify(this.listDatas));
            this.read();
            [...boxInputs].forEach((item:Node):void=> {(item as HTMLInputElement).value = '';});
            if(this.data.keyData === 'listStudent') (document.getElementById('male') as HTMLInputElement).checked = true;
          }
          [...boxInputs].forEach((item:Node):void=> {
            const input = item as HTMLInputElement;
            input.style.border = '1px solid grey';
          });
        }
        [...boxInputs].forEach((item:Node):void=> {
          const input = item as HTMLInputElement;
          input.oninput = ():void => {
            input.style.border = '1px solid grey';
          }
        });
        this.checkBtn = true;
      }
      return false;
    }
  }
  check(): void {
    const btnAdd = document.getElementById(this.data.idBtnAdd) as HTMLElement;
    const btnSave = document.getElementById(this.data.idBtnSave) as HTMLElement;
    const btnSearch = document.getElementById('btnSearch') as HTMLElement;
    const btnTab = document.getElementById(this.data.idBtnTab) as HTMLElement;
    btnAdd.onclick = ():void => {
      this.checkBtn = true;
    }
    btnSave.onclick = ():void => {
      this.checkBtn = false;
    }
    btnTab.addEventListener('click', ():void=> {
      if(this.data.keyData === 'listClass') {
        btnSearch.classList.remove('student');
        btnSearch.classList.add('class');
      } else {
        btnSearch.classList.add('student');
        btnSearch.classList.remove('class');
      }
    });
  }
}

const dataClass:DataHandle = new DataHandle(
  'listClass',
  'tbodyClass',
  'form-class',
  '#form-class>.form-group>input',
  'delete-class_',
  'update-class_',
  'nav-class-tab',
  'btnAddClass',
  'btnSaveClass'
);

const dataStudent:DataHandle = new DataHandle(
  'listStudent',
  'tbodyStudent',
  'form-student',
  '#form-student>.form-group>input',
  'delete-student_',
  'update-student_',
  'nav-student-tab',
  'btnAddStudent',
  'btnSaveStudent'
);

const handleDelete = (elem:HTMLElement):void => {
  elem.id.indexOf('class') !== -1 ? localClass.delete(elem.id) : localStudent.delete(elem.id);
}

const handleUpdate = (elem:HTMLElement):void => {
  elem.id.indexOf('class') !== -1 ? localClass.update(elem.id) : localStudent.update(elem.id);
}

const findDatas = (elem:HTMLElement):void=> {
  if(elem.classList.toString().indexOf('class') != -1) localClass.find();
  else localStudent.find();
}
const localClass = new Services(dataClass);
const localStudent = new Services(dataStudent);
function start(data:Services):void {
  data.read();
  data.check();
  data.create();
  data.default();
}
start(localStudent);
start(localClass);
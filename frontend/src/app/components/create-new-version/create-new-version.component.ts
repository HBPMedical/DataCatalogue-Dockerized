import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {HospitalService} from "../../shared/hospital.service";
import {ActivatedRoute, Params} from "@angular/router";
import {Location} from "@angular/common";
import {MatDialog} from "@angular/material";



@Component({
  selector: 'app-create-new-version',
  templateUrl: './create-new-version.component.html',
  styleUrls: ['./create-new-version.component.css']
})
export class CreateNewVersionComponent implements OnInit, AfterViewInit {

  versionToUpdate: any;
  hospital: any;
  sampleFileName: string;
  disabledInput: boolean;

  newVarFile: string;
  newVarName: string;
  newVarCode: string;
  newVarType: string;
  newVarValues: string;
  newVarUnit: string;
  newVarCanBeNull: string;
  newVarDescription: string;
  newVarComments: string;
  newVarConceptPath: string;
  newVarMethodology: string;
  newVarMapFunction: string;
  newVarMapCDE: string;

  editVarFile: string;
  editVarName: string;
  editVarCode: string;
  editVarType: string;
  editVarValues: string;
  editVarUnit: string;
  editVarCanBeNull: string;
  editVarDescription: string;
  editVarComments: string;
  editVarConceptPath: string;
  editVarMethodology: string;
  editVarMapFunction: string;
  editVarMapCDE: string;

  latestCDEVersion:any;
  versionName: string;
  pathologyName:string;
  functions: Array<any>;

  constructor(private hospitalService: HospitalService, private route: ActivatedRoute, private location: Location, public dialog: MatDialog) {
  }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.hospitalService.getLatestVersionByHospitalId(+params['hospital_id']))
      .subscribe(version => {
        this.hospitalService.getFunctionsByVariableVersionId(version['version_id']).subscribe(functions => {
          console.log("version id is  -- >",version['version_id']);
          for(let i in version['variables']){
            let versionvariable = version['variables'][i];
            version['variables'][i]['mapFunction'] = '';
            version['variables'][i]['mapCDE'] = '';
            let mappingCDEs='';
            let mappingFunctions='';
            for(let func of functions){
              for (let functionvariable of func['variables']){
                if(versionvariable['variable_id']==functionvariable['variable_id']){
                  if(mappingFunctions != ''){
                    if(mappingFunctions.includes(',')){
                      mappingFunctions = mappingFunctions +',['+ func['rule']+']';
                    }else{
                      mappingFunctions = '['+mappingFunctions+']' +',['+ func['rule']+']';
                    }
                  }else{
                    mappingFunctions = func['rule'];
                  }
                  for(let functioncdevariable of func['cdeVariables']){
                    if(mappingCDEs !=''){

                      mappingCDEs = mappingCDEs +','+ functioncdevariable['code'];
                    }else{
                      mappingCDEs = functioncdevariable['code'];
                    }
                  }
                }
              }
            }
            version['variables'][i]['mapFunction'] = mappingFunctions;
            version['variables'][i]['mapCDE'] = mappingCDEs;
          }
          //version['variables'][0]['ok'] = "hey";
          console.log("version variables",version['variables']);
          this.versionToUpdate = version;
        });

      });

    this.route.params
      .switchMap((params: Params) => this.hospitalService.getHospitalById(+params['hospital_id']))
      .subscribe(h => {
        this.hospital = h
      });

    this.hospitalService.getLatestCDEVersion().subscribe(cde=>{this.latestCDEVersion = cde});

///////////////////////////////////////////////

    this.route.params
      .switchMap((params: Params) => this.hospitalService.getPathologyById(+params['pathology_id']))
      .subscribe(path => {
       console.log('Path name: '+path['name']);
        this.pathologyName = path['name']});

  }


  ngAfterViewInit(): void {
    this.createSampleFileName();

  }


  saveNewVersion(): void {
    this.createNewVersionName();
    this.hospitalService.createNewVersion(this.hospital["name"], this.versionName, this.versionToUpdate).subscribe(
      data => {
        window.alert("Version created successfully.");
        this.location.back();
      },
      error => {
        if (error.status == '401') {
          alert("You need to be logged in to complete this action.");
        } else {
          alert("Error Occurred:\n"+error.error);
        }
      });

  };

  goBack() {
    this.location.back();
  }

  uploadFile() {
    console.log(this.sampleFileName);
    window.location.href = this.location.path() + '/' + this.sampleFileName;
  }


  createSampleFileName() {
    var oldName = parseInt(this.versionToUpdate.name.replace('v', ''));
    oldName = oldName + 1;
    this.sampleFileName = this.pathologyName+'_'+this.hospital.name + "_" + "v" + oldName.toString() + ".xlsx";
  }

  createNewVersionName() {
    var oldName = parseInt(this.versionToUpdate.name.replace('v', ''));
    oldName = oldName + 1;
    this.versionName = "v" + oldName.toString();
  }


  addNewVariable() {
    let newVar = Object.assign(Object.create(this.versionToUpdate.variables[this.versionToUpdate.variables.length - 1]));
    //var newVar: VariableOject={};
    if (this.checkIfCoceprPathIsValid(this.newVarConceptPath) && this.checkIfCodeIsNull(this.newVarCode) &&
      this.checkIfTypeIsNull(this.newVarType) && this.checkIfConceptPathIsNull(this.newVarConceptPath)&&
      this.checkIfMappingFunctionIsValid(this.newVarMapFunction) && this.checkIfMappingCDEIsValid(this.newVarMapCDE)) {

      newVar.csvFile = this.ifNullEmptyElseTheSame(this.newVarFile);
      newVar.name = this.ifNullEmptyElseTheSame(this.newVarName);
      newVar.code = this.ifNullEmptyElseTheSame(this.newVarCode);
      newVar.type = this.ifNullEmptyElseTheSame(this.newVarType);
      newVar.values = this.ifNullEmptyElseTheSame(this.newVarValues);
      newVar.unit = this.ifNullEmptyElseTheSame(this.newVarUnit);
      newVar.canBeNull = this.ifNullEmptyElseTheSame(this.newVarCanBeNull);
      newVar.description = this.ifNullEmptyElseTheSame(this.newVarDescription);
      newVar.comments = this.ifNullEmptyElseTheSame(this.newVarComments);
      newVar.conceptPath = this.ifNullEmptyElseTheSame(this.newVarConceptPath);
      newVar.methodology = this.ifNullEmptyElseTheSame(this.newVarMethodology);
      newVar.mapFunction = this.ifNullEmptyElseTheSame(this.newVarMapFunction);
      newVar.mapCDE = this.ifNullEmptyElseTheSame(this.newVarMapCDE);
      this.newVarMapCDE = "";
      this.newVarFile = "";
      this.newVarName = "";
      this.newVarCode = "";
      this.newVarType = "";
      this.newVarValues = "";
      this.newVarUnit = "";
      this.newVarCanBeNull = "";
      this.newVarDescription = "";
      this.newVarComments = "";
      this.newVarConceptPath = "";
      this.newVarMethodology = "";
      this.newVarMapFunction = "";

      this.versionToUpdate.variables.unshift(newVar);
    }

    //alert("The variable : "+this.newVarName+" was created");
  }

  checkIfMappingFunctionIsValid(mappingFunction){
    if(mappingFunction != null){
      if(mappingFunction.includes('[') || mappingFunction.includes(']')){
        mappingFunction = mappingFunction.replace(/\s/g, "");
        if(mappingFunction.startsWith('[') && mappingFunction.endsWith(']') && mappingFunction.includes('],[')){
          return true;
        }else{
          alert("Invalid format of the mapping function for mapping to multiple CDEs.\nValid example: [stays the same],[stays the same]");
          return false;
        }
      }else{
        return true;
      }
    }else{
      return true;
    }

  }

  checkIfMappingCDEIsValid(mappingCde){
    if(mappingCde != null && mappingCde != ''){
    var cdes = mappingCde.split(",");
    for(let cde of cdes){
      for(let cdevariable of this.latestCDEVersion['cdevariables']){
      if(cdevariable['code'] == cde){
        return true;
      }
      }
    }
    alert("The cdeVariable is not valid.");
    return false;
    }else{
      return true;
    }
  }
  checkIfCoceprPathIsValid(conceptPath) {
    if (conceptPath == null || conceptPath == 'undefined' || conceptPath == "") {
      return true;
    } else if (conceptPath.startsWith("/"+this.pathologyName)) {
      return true;
    } else {
      alert("Invalid concept path. It should start with: /"+this.pathologyName);
      return false;
    }
  }

  checkIfCodeIsNull(code) {
    if (code != null && code != "") {
      return true;
    } else {
      alert("Code cannot be null.");
      return false;
    }
  }

  checkIfTypeIsNull(type) {
    if (type != null && type != "") {
      return true;
    } else {
      alert("Type cannot be null.");
      return false;
    }
  }

  checkIfConceptPathIsNull(conceptPath) {
    if (conceptPath != null && conceptPath != "") {
      return true;
    } else {
      alert("Concept Path cannot be null.");
      return false;
    }
  }

  ifNullEmptyElseTheSame(value) {
    if (value != null) {
      return value;
    } else {
      return "";
    }
  }

  toggleEdit() {
    this.disabledInput = !this.disabledInput;
  }

  deleteVariable(currentIndex) {
    this.versionToUpdate.variables.splice(currentIndex, 1);
  }

  change(element, value) {
    if (element == 1) {
      this.editVarFile = value;
    } else if (element == 2) {
      this.editVarName = value;
    } else if (element == 3) {
      this.editVarCode = value;
    } else if (element == 4) {
      this.editVarType = value;
    } else if (element == 5) {
      this.editVarValues = value;
    } else if (element == 6) {
      this.editVarUnit = value;
    } else if (element == 7) {
      this.editVarCanBeNull = value;
    } else if (element == 8) {
      this.editVarDescription = value;
    } else if (element == 9) {
      this.editVarComments = value;
    } else if (element == 10) {
      this.editVarConceptPath = value;
    } else if (element == 11) {
      this.editVarMethodology = value;
    } else if (element == 12) {
      this.editVarMapFunction = value;
    } else if (element == 13) {
      this.editVarMapCDE = value;
    }
  }

  saveVariable(currentIndex) {
    if (this.editVarName != null) {
      this.versionToUpdate.variables[currentIndex].name = this.editVarName;
      this.editVarName = null;
    }
    if (this.editVarCode != null) {
      this.versionToUpdate.variables[currentIndex].code = this.editVarCode;
      this.editVarCode = null;
    }
    if (this.editVarFile != null) {
      this.versionToUpdate.variables[currentIndex].csvFile = this.editVarFile;
      this.editVarFile = null;
    }
    if (this.editVarType != null) {
      this.versionToUpdate.variables[currentIndex].type = this.editVarType;
      this.editVarType = null;
    }
    if (this.editVarValues != null) {
      this.versionToUpdate.variables[currentIndex].values = this.editVarValues;
      this.editVarValues = null;
    }
    if (this.editVarUnit != null) {
      this.versionToUpdate.variables[currentIndex].unit = this.editVarUnit;
      this.editVarUnit = null;
    }
    if (this.editVarCanBeNull != null) {
      this.versionToUpdate.variables[currentIndex].canBeNull = this.editVarCanBeNull;
      this.editVarCanBeNull = null;
    }
    if (this.editVarDescription != null) {
      this.versionToUpdate.variables[currentIndex].description = this.editVarDescription;
      this.editVarDescription = null;
    }
    if (this.editVarComments != null) {
      this.versionToUpdate.variables[currentIndex].comments = this.editVarComments;
      this.editVarComments = null;
    }
    if (this.editVarConceptPath != null && this.checkIfCoceprPathIsValid(this.editVarConceptPath)) {
      this.versionToUpdate.variables[currentIndex].conceptPath = this.editVarConceptPath;
      this.editVarConceptPath = null;
    }
    if (this.editVarMethodology != null) {
      this.versionToUpdate.variables[currentIndex].methodology = this.editVarMethodology;
      this.editVarMethodology = null;
    }
    if (this.editVarMapFunction != null && this.checkIfMappingFunctionIsValid(this.editVarMapFunction)) {
      this.versionToUpdate.variables[currentIndex].mapFunction = this.editVarMapFunction;
      this.editVarMapFunction = null;
    }
    if (this.editVarMapCDE != null && this.checkIfMappingCDEIsValid(this.editVarMapCDE)) {
      this.versionToUpdate.variables[currentIndex].mapCDE = this.editVarMapCDE;
      this.editVarMapCDE = null;
    }

  }


}

interface VariableOject {
  //[key: string]: any
  [s: string]: string;
}


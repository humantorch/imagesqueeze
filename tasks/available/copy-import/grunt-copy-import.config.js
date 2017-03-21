module.exports = function (grunt) {

    return {
        "copy-import-google"    :{
            "main":{
                "options":{
                    "edit-google-spreadsheet":{
                        "spreadsheetId":'1SYnnG5fFkV08MzVYXw-xHl24fflEmjsLOfIRM_yAN6Q', //'GOOGLE SPREADSHEET ID',
                        "worksheetId": "od6",
                        "oauth"        :{
                            //# Share spreadhseet with this user
                            "email":'956167436075-compute@developer.gserviceaccount.com',

                            //# Find this in keypass (Google Copy Deck importer client).  Don't add to source control.
                            "keyFile":'config/autocopy.pem'
                        }
                    }
                },
                "files"  :[{
                    src :["copy"], //# Sheet name
                    dest:"assets/locale/locale_export.csv"
                }
                ]
            }
        },
        "copy-import-convert"   :{
            "main":{
                "files":[{
                    src :["assets/locale/locale_export.csv"],
                    dest:"assets/json/"
                }]
            }
        }

    }

};
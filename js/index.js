/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

    alertView: function () {
        navigator.notification.alert('You are the winner!', null, 'Game Over', 'Done');
        //           {
        //               onClose: function(buttonIndex) {
        //                    if (buttonIndex == 1)
        //                    {
        //                        alert("1111");
        //                    }
        //                   else
        //                   {
        //                        alert("0000");
        //                   }
        //                }
        //           };
    },

    loginConnection: function () {
                var userName = $('#EmailField').val();
                var password = $('#PasswordField').val();
                if (userName.length > 0 && password.length > 0) 
                {
                    var lPostBody = {
                        "<Email>k__BackingField": userName,
                        "<Password>k__BackingField": password
                    };
                    lPostBody = JSON.stringify(lPostBody);
                    connectionManager.initWithUrlAndBody('ApiLogin/ValidateUser', lPostBody);
                }
            },

};

var parseObject = function(lObject){
       for(var lPropertyName in lObject)
            {                
                var lValue = lObject[lPropertyName];
                console.log("name: " + lPropertyName + " value: " + lValue);
            }
};

var TxConstants = {    
    BaseUrl: 'http://14.141.30.254:781/api/',//'http://14.141.30.254:889/api/',
};

var connectionManager =  {
    //constructor
    initWithUrlAndBody:function(url, body)
    {
        //@"http://14.141.30.254:889/api/" //"http://14.141.30.254:781/api/"
    var baseUrl = TxConstants.BaseUrl + url;
    var connection =  $.ajax({
            type: 'POST',
            url: baseUrl,
            data: body,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success:this.connectionResult,
            headers:{
                'Authorization-Token':'',
                'CurrentUser':$.base64.encode(UserDataModel.UserId)   
            }
        });
    connection.fail(this.connectionError);
    },
    
    connectionResult:function(response)
    {
        var lIsRegistered = response["<IsRegistered>k__BackingField"];
        if(lIsRegistered == 1)
        {
            UserDataModel.initialize(response);
            
            $("#welcomeLabel").html(UserDataModel.UserName);
            $.mobile.navigate("#jDashboardPage", { transition : "slide", info: "info about the #bar hash" });
            
            //            saveUserInfo(response);
//            saveLoginCrendentials();
//            document.location.href = "#jDashboardPage";
            //$.mobile.navigate( "#second", { transition : "slide", info: "info about the #bar hash" });
        }
        else
        {
            alert("Invalid Credentials \n There seems to be a problem with the username and password you have entered. Please re-enter your username and password.");
        }
        alert('success callback.');
        
    },
    
    connectionError:function (request, status, error) {
//                parseObject(request);
            alert("Error Response = " + JSON.stringify(request));
        //        document.location.href = '#jDashboardPage';
    }
};

var  UserDataModel = {
    UserName    :   '',
    UserId      :   '0',
    UserType    :   '',
    UserToken   :   '',
    ContactNo   :   '',
    Email       :   '',
    Password    :   '',
    FirstName   :   '',
    LastName    :   '',
    
    initialize: function (response)
    {
            this.UserName   =   response['<UserName>k__BackingField'];
            this.UserId     =   response['<UserId>k__BackingField']; 
            this.UserType   =   response['<UserType>k__BackingField'];
            this.UserToken  =   response['<UserToken>k__BackingField'];
            this.ContactNo  =   response['<Phone>k__BackingField'];
            this.Password   =   response['<Password>k__BackingField'];
            this.LastName   =   response['<LastName>k__BackingField'];
            this.FirstName  =   response['<FirstName>k__BackingField'];
            this.Email      =   response['<Email>k__BackingField'];
    }
};

var StudyDataModel = {
    getStudyList:function()
    {
          var lUrl = TxConstants.BaseUrl + "/apiDashboard?userId=" + UserDataModel.UserId +"&userTypeId="+UserDataModel.UserType+"&roleId=1";
            $.ajax({
                   type: "GET",
                   url: lUrl,
                   dataType: "json",
                   success: this.resultData,
                   error:  function(){
                                alert('error'); },
                   headers:{
                            'Authorization-Token':UserDataModel.UserToken,
                            'CurrentUser':$.base64.encode(UserDataModel.UserId)   
                        }
                 });
    },
    
    resultData: function StudyList(response) {
    var lStudyList = response["CurrentStudies"];
    var lStudyListTable = "<table cellpadding='0' cellspacing='0' id='StudyListTable'>";
    for (i = 0; i < lStudyList.length; ++i) 
      {
        var lStudyName = lStudyList[i]["StudyName"];
        var lStudyId   = lStudyList[i]["StudyId"];
        var lCellData = "<tr><div><div><span class='left'><img src='img/studyIcon.png'/></span>" +
                                "<span  style='font-size:30px;'>" + lStudyName + "</span>" +
                                "<span class='right'><img src='img/details.png'/></span>" +
                        "</div></br>" +
                        "<div><span id='userName' style='color: rgb(0,185,235);'>john</span> has assigned the study <span id='studyName' style='color: rgb(0,185,235);'>study name</span> to you. Please start programming.</div>" +
                        "<div>" +
                            "<span class='left'>time stamp</span>" +
                            "<span class='right'>" +
                                "<a class='optionButton1'><img src='img/logout.png'/></a>" +
                                "<a class='optionButton2'><img src='img/logout.png'/></a>" +
                                "<a class='optionButton3'><img src='img/logout.png'/></a>" +
                            "</span>" +
                        "</div></div></tr>" +
                        "<hr style='color:black; width:95%; padding:0px 5px 0px 5px;'/>";
            lStudyListTable = lStudyListTable.concat(lCellData);
        }
        lStudyListTable = lStudyListTable.concat('</table>');
    $('#liStudyListTable').html(lStudyListTable);
        alert(lStudyListTable);
    }
};

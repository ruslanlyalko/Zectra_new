Zectranet.controller('QNAController', ['$scope', '$http',
    function($scope, $http) {

        $scope.urlGetQNAProjectSettingInfo = JSON_URLS.urlGetQNAProjectSettingInfo;
        $scope.urlSendQNAProjectRequest = JSON_URLS.urlSendQNAProjectRequest;
        $scope.urlDeleteQNAProjectRequest = JSON_URLS.urlDeleteQNAProjectRequest;





        $scope.HO_Contacts = [];
        $scope.All_Contacts = [];
        $scope.Project_Team = [];

        $scope.HO_contact_message = '';
        $scope.All_contact_message = '';
        $scope.HO_Contacts_test = false;
        $scope.All_Contacts_test = false;


        function somethingWentWrong() {
            $scope.modal.class = 'label-danger';
            $scope.modal.message = 'Something went wrong.';
            $scope.modal.title = 'Error';
            $('#header_forum_messages_modal').modal('show');
        }



        $scope.getProjectSettingInfo = function () {
            $http.get($scope.urlGetQNAProjectSettingInfo)
                .success(function (response) {
                    $scope.HO_Contacts = response.HO_Contacts;
                    $scope.All_Contacts = response.All_Contacts;
                    $scope.Project_Team = response.Project_Team;

                    for(var i = 0; i < $scope.HO_Contacts.length;i++)
                    {
                        $scope.HO_Contacts[i].checked = false;
                    }
                    for(i = 0; i < $scope.All_Contacts.length;i++)
                    {
                        $scope.All_Contacts[i].checked = false;
                    }

                })
        };

        $scope.contactChecked = function (type,index, array) {
            for(var i=0;i<array.length;i++)
            {
                array[i].checked = ( i == index) ;
            }
            $scope.testClickableButton(type,array);
        };


        $scope.SendRequest = function (type,message,array)
        {
            var user_id = 0;

            for(var i=0;i<array.length;i++)
            {
                if(array[i].checked)
                {
                    user_id = array[i].id;
                }
            }

            $http.post($scope.urlSendQNAProjectRequest,{'message':message,'user_id': user_id})
                .success(function (response) {
                    if(response == 1)
                    {
                        if(type == 1)
                        {
                            $scope.HO_contact_message ='';
                            $('#send_request_by_HO_contacts').modal('hide');
                        }
                        else if(type == 2)
                        {
                            $scope.All_contact_message ='';
                            $('#send_request_by_All_contacts').modal('hide');
                        }
                        $scope.getProjectSettingInfo();
                    }
                })
        };

        $scope.testClickableButton = function (type,array) {
            for(var i=0; i< array.length; i++)
            {
                if(type == 1)
                {
                    if(array[i].checked)
                    {
                        $scope.HO_Contacts_test = true;
                        break;
                    }
                    else
                    {
                        $scope.HO_Contacts_test = false;
                    }
                }
                if(type == 2)
                {
                    if(array[i].checked)
                    {
                        $scope.All_Contacts_test = true;
                        break;
                    }
                    else
                    {
                        $scope.All_Contacts_test = false;
                    }
                }
            }
        }

        $scope.deleteProjectRequest = function (request_id) {
            var urlDeleteQNAProjectRequest = $scope.urlDeleteQNAProjectRequest.replace('requestid',request_id);
            $http.delete(urlDeleteQNAProjectRequest)
                .success(function (response) {
                    switch (response)
                    {
                        case 0:
                            alert(' Not found ');
                            break;
                        case 1:
                            alert(' Success ');
                            break;
                        case -1:
                            alert(' Exception ');
                            break;
                    }
                    $scope.getProjectSettingInfo();
                })
        }

    }
]);
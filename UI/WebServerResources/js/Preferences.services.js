(function(){"use strict";function Preferences(){var _this=this;this.defaults={};this.settings={};this.defaultsPromise=Preferences.$$resource.fetch("jsonDefaults").then(function(data){var labels=_.object(_.map(data.SOGoMailLabelsColors,function(value,key){if(key.charAt(0)=="$")return["_"+key,value];return[key,value]}));data.SOGoMailLabelsColors=labels;if(data.Vacation){if(data.Vacation.endDate)data.Vacation.endDate=new Date(parseInt(data.Vacation.endDate)*1e3);else{data.Vacation.endDateEnabled=0;data.Vacation.endDate=new Date}if(data.Vacation.autoReplyEmailAddresses)data.Vacation.autoReplyEmailAddresses=data.Vacation.autoReplyEmailAddresses.join(",")}else{data.Vacation={};data.Vacation.endDateEnabled=0;data.Vacation.endDate=new Date}if(data.Forward&&data.Forward.forwardAddress)data.Forward.forwardAddress=data.Forward.forwardAddress.join(",");angular.extend(_this.defaults,data);return _this.defaults});this.settingsPromise=Preferences.$$resource.fetch("jsonSettings").then(function(data){if(data.Calendar){if(data.Calendar.PreventInvitationsWhitelist)data.Calendar.PreventInvitationsWhitelist=_.map(data.Calendar.PreventInvitationsWhitelist,function(value,key){var match=/^(.+)\s<(\S+)>$/.exec(value);return new Preferences.$User({uid:key,cn:match[1],c_email:match[2]})});else data.Calendar.PreventInvitationsWhitelist=[]}angular.extend(_this.settings,data);return _this.settings})}Preferences.$factory=["$q","$timeout","$log","sgSettings","Resource","User",function($q,$timeout,$log,Settings,Resource,User){angular.extend(Preferences,{$q:$q,$timeout:$timeout,$log:$log,$$resource:new Resource(Settings.activeUser("folderURL"),Settings.activeUser()),activeUser:Settings.activeUser(),$User:User});return new Preferences}];try{angular.module("SOGo.PreferencesUI")}catch(e){angular.module("SOGo.PreferencesUI",["SOGo.Common"])}angular.module("SOGo.PreferencesUI").factory("Preferences",Preferences.$factory);Preferences.prototype.ready=function(){return Preferences.$q.all([this.defaultsPromise,this.settingsPromise])};Preferences.prototype.$save=function(){var _this=this;return Preferences.$$resource.save("Preferences",this.$omit(true)).then(function(data){return data})};Preferences.prototype.$omit=function(deep){var preferences,labels,whitelist;preferences={};whitelist={};angular.forEach(this,function(value,key){if(key!="constructor"&&key[0]!="$"){if(deep)preferences[key]=angular.copy(value);else preferences[key]=value}});labels=_.object(_.map(preferences.defaults.SOGoMailLabelsColors,function(value,key){if(key.charAt(0)=="_"&&key.charAt(1)=="$")return[key.substring(1),value];return[key,value]}));preferences.defaults.SOGoMailLabelsColors=labels;if(preferences.defaults.Vacation){if(preferences.defaults.Vacation.endDateEnabled)preferences.defaults.Vacation.endDate=preferences.defaults.Vacation.endDate.getTime()/1e3;else preferences.defaults.Vacation.endDate=0;if(preferences.defaults.Vacation.autoReplyEmailAddresses)preferences.defaults.Vacation.autoReplyEmailAddresses=preferences.defaults.Vacation.autoReplyEmailAddresses.split(",");else preferences.defaults.Vacation.autoReplyEmailAddresses=[]}if(preferences.defaults.Forward&&preferences.defaults.Forward.forwardAddress)preferences.defaults.Forward.forwardAddress=preferences.defaults.Forward.forwardAddress.split(",");if(preferences.settings.Calendar&&preferences.settings.Calendar.PreventInvitationsWhitelist){_.each(preferences.settings.Calendar.PreventInvitationsWhitelist,function(user){whitelist[user.uid]=user.$shortFormat()});preferences.settings.Calendar.PreventInvitationsWhitelist=whitelist}return preferences}})();
//# sourceMappingURL=Preferences.services.js.map
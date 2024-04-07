function fLoadTKOTheme(){
  fCheckIfProduction();
  fLoadRemindersToTechDoc();
  fStyleTableCodeSelector();
  fStyleSectionHeader();
  fStyleProcedureChecklist();
  fStyleStoredForm();
  fStyleDocumentTips();
  fStyleContentToggle();
  fStyleContentModal();
  fStyleContentModeless();
  fStyleContentOverlay();
  fStyleTableDropdownSelector();
  fStyleTableListSelector();
  fStyleParamSetDefinition();
  fStyleMailerForm();
  fSetGenericDocumentClick();
  
  fLoadXMLDatabase();
  fBuildDocumentMenu();
  fBuildDocumentFooter();
  fBuildTopicIndex();
  fBuildTopicPreview()
  fBuildDocumentHistory();
  fBuildCustomTable();
  fBuildFlexiTable(); //this should replace fCustomTable in the future
  fStyleSortableTable();
  fStyleFilterableTable();
  fBuildCustomIndex();
  fBuildCustomList();
  fBuildCustomSelector();
  fBuildTopicShortcut();
  fStyleModalNotification();
  fSetReviewSchematicLink();
  fAddMyCEtvLink()
  fAddMyCEtvLink2()
}

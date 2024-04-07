/****** JS for parts research in TKO docs ******/
function fLoadProductPrt(sProductPath){
  fCheckThemePath();
  fXmlLoad_TkoIndex();
  fSelectorSegment_Create(sProductPath);
}

unit ApplyCustomScripted;

var
  HeaderPrinted: Boolean;

function CleanId(s: string): string;
var
  i: Integer;
  ch: string;
  resultStr: string;
begin
  s := LowerCase(s);
  resultStr := '';

  for i := 1 to Length(s) do begin
    ch := Copy(s, i, 1);

    // letters + numbers
    if ((ch >= 'a') and (ch <= 'z')) or ((ch >= '0') and (ch <= '9')) then
      resultStr := resultStr + ch

    // apostrophes → REMOVE
    else if ch = '''' then
      Continue

    // spaces + dashes → underscore
    else if (ch = ' ') or (ch = '-') then
      resultStr := resultStr + '_'

    // everything else → underscore
    else
      resultStr := resultStr + '_';
  end;

  while Pos('__', resultStr) > 0 do
    resultStr := StringReplace(resultStr, '__', '_', [rfReplaceAll]);

  if Length(resultStr) > 0 then
    if Copy(resultStr, Length(resultStr), 1) = '_' then
      Delete(resultStr, Length(resultStr), 1);

  Result := resultStr;
end;

function Csv(s: string): string;
begin
  s := StringReplace(s, '"', '""', [rfReplaceAll]);
  Result := '"' + s + '"';
end;

function GetEffectType(effectData: IInterface): string;
var
  effectName, effectId: string;
begin
  effectName := GetEditValue(ElementByPath(effectData, 'FULL - Name'));
  effectId := LowerCase(effectName);

  effectId := StringReplace(effectId, ' ', '_', [rfReplaceAll]);
  effectId := StringReplace(effectId, '-', '_', [rfReplaceAll]);

  // 🔥 SPECIAL CASE FIRST
  if Pos('reflect_damage', effectId) > 0 then begin
    Result := 'positive'; Exit;
  end;

  // ❌ NEGATIVE EFFECT PATTERNS
  if Pos('damage', effectId) > 0 then begin
    Result := 'negative'; Exit;
  end;

  if Pos('weakness', effectId) > 0 then begin
    Result := 'negative'; Exit;
  end;

  if Pos('lingering', effectId) > 0 then begin
    Result := 'negative'; Exit;
  end;

  if Pos('drain', effectId) > 0 then begin
    Result := 'negative'; Exit;
  end;

  if Pos('fear', effectId) > 0 then begin
    Result := 'negative'; Exit;
  end;

  if Pos('frenzy', effectId) > 0 then begin
    Result := 'negative'; Exit;
  end;

  if Pos('paralysis', effectId) > 0 then begin
    Result := 'negative'; Exit;
  end;

  if Pos('slow', effectId) > 0 then begin
    Result := 'negative'; Exit;
  end;

  if Pos('tardiness', effectId) > 0 then begin
    Result := 'negative'; Exit;
  end;

  // ✅ DEFAULT
  Result := 'positive';
end;

function Filter(e: IInterface): Boolean;
var
  i: Integer;
  effects, effect, baseEffect, effectData, efit: IInterface;
  ingredientName, ingredientId, ingredientFormId: string;
  effectName, effectId, effectFormId, effectType: string;
  magnitude, duration, weight, value: string;
  row: string;
begin
  if IsWinningOverride(e) = False then begin
    Result := False;
    Exit;
  end;

  if HeaderPrinted = False then begin
    AddMessage('ingredient_id,ingredient_name,ingredient_form_id,effect_id,effect_name,effect_form_id,effect_type,effect_order,magnitude,duration,weight,value');
    HeaderPrinted := True;
  end;

  ingredientName := GetEditValue(ElementByPath(e, 'FULL - Name'));
  ingredientId := CleanId(ingredientName);
  ingredientFormId := IntToHex(GetLoadOrderFormID(e), 8);

  weight := GetEditValue(ElementByPath(e, 'DATA - DATA\Weight'));
  value := GetEditValue(ElementByPath(e, 'DATA - DATA\Value'));

  effects := ElementByName(e, 'Effects');

  for i := 0 to ElementCount(effects) - 1 do begin
    effect := ElementByIndex(effects, i);

    baseEffect := ElementBySignature(effect, 'EFID');
    effectData := LinksTo(baseEffect);
    efit := ElementBySignature(effect, 'EFIT');

    effectName := GetEditValue(ElementByPath(effectData, 'FULL - Name'));
    effectId := CleanId(effectName);
    effectFormId := IntToHex(GetLoadOrderFormID(effectData), 8);
    effectType := GetEffectType(effectData);

    magnitude := GetEditValue(ElementByPath(efit, 'Magnitude'));
    duration := GetEditValue(ElementByPath(efit, 'Duration'));

    row :=
      Csv(ingredientId) + ',' +
      Csv(ingredientName) + ',' +
      Csv(ingredientFormId) + ',' +
      Csv(effectId) + ',' +
      Csv(effectName) + ',' +
      Csv(effectFormId) + ',' +
      Csv(effectType) + ',' +
      Csv(IntToStr(i + 1)) + ',' +
      Csv(magnitude) + ',' +
      Csv(duration) + ',' +
      Csv(weight) + ',' +
      Csv(value);

    AddMessage(row);
  end;

  Result := True;
end;

function Initialize: Integer;
begin
  HeaderPrinted := False;

  FilterBySignature := True;
  FilterSignatures := 'INGR';
  FilterScripted := True;

  ApplyFilter;

  Result := 1;
end;

function Finalize: Integer;
begin
  Result := 0;
end;

function Process(e: IInterface): Integer;
begin
  Result := 0;
end;

end.
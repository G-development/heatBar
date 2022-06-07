export const createProps = (layout) => {
  var hb = layout.heatBar;
  var allProps = {
    // General
    flagsInCircle:
      hb.flagsInCircle && hb.flagsInCircle != null && hb.flagsInCircle != ""
        ? hb.flagsInCircle
        : false,
    iconShowMore:
      hb.iconShowMore && hb.iconShowMore != null && hb.iconShowMore != ""
        ? hb.iconShowMore
        : "https://www.picng.com/upload/plus/png_plus_52132.png",

    // Bar settings
    barWidth:
      hb.barWidth && hb.barWidth != null && hb.barWidth != ""
        ? hb.barWidth
        : "30%",
    barHeight:
      hb.barHeight && hb.barHeight != null && hb.barHeight != ""
        ? hb.barHeight
        : "",
    barBorders:
      hb.barBorders && hb.barBorders != null && hb.barBorders != ""
        ? hb.barBorders
        : 5,
    barFColor:
      hb.barFColor && hb.barFColor != null && hb.barFColor != ""
        ? hb.barFColor
        : "#ff0000",
    barSColor:
      hb.barSColor && hb.barSColor != null && hb.barSColor != ""
        ? hb.barSColor
        : "#00ff00",

    // Axis settings
    axisSwitch:
      hb.axisSwitch && hb.axisSwitch != null && hb.axisSwitch != ""
        ? hb.axisSwitch
        : false,
    axisNice:
      hb.axisNice && hb.axisNice != null && hb.axisNice != ""
        ? hb.axisNice
        : false,
    axisPosition:
      hb.axisPosition && hb.axisPosition != null && hb.axisPosition != ""
        ? hb.axisPosition
        : "l",
    axisPercentage:
      hb.axisPercentage && hb.axisPercentage != null && hb.axisPercentage != ""
        ? hb.axisPercentage == "True"
          ? true
          : false
        : false,
    axisLValue:
      hb.axisLValue && hb.axisLValue != null && hb.axisLValue != ""
        ? hb.axisLValue
        : "",
    axisHValue:
      hb.axisHValue && hb.axisHValue != null && hb.axisHValue != ""
        ? hb.axisHValue
        : "",

    // Tooltip
    tooltipTitle:
      hb.tooltipTitle && hb.tooltipTitle != null && hb.tooltipTitle != ""
        ? hb.tooltipTitle
        : false,
    tooltipTrim:
      hb.tooltipTrim && hb.tooltipTrim != null && hb.tooltipTrim != ""
        ? hb.tooltipTrim
        : false,
    tooltipMaxCols:
      hb.tooltipMaxCols && hb.tooltipMaxCols != null && hb.tooltipMaxCols != ""
        ? hb.tooltipMaxCols
        : 3,
    tooltipMaxRows:
      hb.tooltipMaxRows && hb.tooltipMaxRows != null && hb.tooltipMaxRows != ""
        ? hb.tooltipMaxRows
        : "",
    tooltipImgWidth:
      hb.tooltipImgWidth &&
      hb.tooltipImgWidth != null &&
      hb.tooltipImgWidth != ""
        ? hb.tooltipImgWidth
        : "40px",
  };
  return allProps;
};

import * as d3 from "d3";

export const createData = (mat, country, data, vals) => {
  mat.forEach((x) => {
    var dataObj = {};
    //dataObj["name"] ???
    dataObj["iso"] = x[0].qText;
    dataObj["val"] = x[1].qNum;
    dataObj["valText"] = x[1].qText;
    dataObj["imgPath"] =
      "../extensions/heatBar/assets/" +
      country.find((item) => item.code == x[0].qText.toLowerCase()).flag_4x3;
    dataObj["imgPath1x1"] =
      "../extensions/heatBar/assets/" +
      country.find((item) => item.code == x[0].qText.toLowerCase()).flag_1x1;
    dataObj["name"] = country.find(
      (item) => item.code == x[0].qText.toLowerCase()
    ).name;

    // Navigation
    dataObj["SheetNav"] = x[1]?.qAttrExps.qValues[0].qText;
    dataObj["SheetSel"] = x[1]?.qAttrExps.qValues[1].qText;
    dataObj["SheetClear"] = x[1]?.qAttrExps.qValues[2].qText;

    data.push(dataObj);
    vals.push(x[1].qNum);
  });
  // Sort the data array (for the imgs overlapping)
  data.sort(dynamicSort("val"));
};

const dynamicSort = (property) => {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    /* next line works with strings and numbers,
     * and you may want to customize it to your needs
     */
    var result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
};

export const createSVGElem = (elementId, width, height, margin) => {
  $("#" + elementId).empty();
  var extSvg = d3
    .select("#" + elementId)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  var svg = extSvg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "heatBar")
    .attr("id", "heatBar_" + elementId);

  return svg;
};

export const defineGradients = (svg, elementId, fColor, sColor) => {
  var gradient = svg
    .append("svg:defs")
    .append("svg:linearGradient")
    .attr("id", "gradient_" + elementId)
    .attr("x1", "0%")
    .attr("y1", "100%") // gradient starting from the bottom
    .attr("x2", "0%")
    .attr("y2", "0%")
    .attr("spreadMethod", "pad");

  gradient
    .append("svg:stop")
    .attr("offset", "0%")
    .attr("stop-color", fColor)
    .attr("stop-opacity", 1);

  // gradient
  //   .append("svg:stop")
  //   .attr("offset", "50%")
  //   .attr("stop-color", "yellow")
  //   .attr("stop-opacity", 1);

  gradient
    .append("svg:stop")
    .attr("offset", "100%")
    .attr("stop-color", sColor)
    .attr("stop-opacity", 1);
};

export const manageAxis = (
  elementId,
  svg,
  HB_Rect,
  axisSwitch,
  axisPosition,
  usePercentage,
  scale,
  barHeight
) => {
  if (axisSwitch) {
    var axis = usePercentage
      ? axisPosition == "l"
        ? d3.axisLeft().scale(scale).tickFormat(d3.format(".0%"))
        : d3.axisRight().scale(scale).tickFormat(d3.format(".0%"))
      : axisPosition == "l"
      ? d3.axisLeft().scale(scale)
      : d3.axisRight().scale(scale);

    var rectBbox = document
      .querySelector("#" + elementId + " g[name]") //name="bar"
      .getBBox(); // gets the information of the rect

    var allAxis = svg
      .append("g")
      .attr("id", "axis_"+elementId)
      .call(axis)
      .attr("height", barHeight)
      .attr("transform", "translate(" + (rectBbox.width + 10) + ",0)");

    var axisBbox = document
      .querySelector("#axis_"+ elementId)
      .getBBox(); // gets the information of the axis

    if (axisPosition == "l") {
      allAxis.attr("transform", "translate(" + axisBbox.width + ",0)");
      HB_Rect.attr("transform", "translate(" + (axisBbox.width + 10) + ",0)");
    }
  }
};

export const createRefLine = (group, item, scale, rlWidths) => {
  item.refLineColor = item.refLineColor ? item.refLineColor : "black";
  item.refLinePre = item.refLinePre != null ? item.refLinePre : "";
  item.refLinePost = item.refLinePost != null ? item.refLinePost : "";
  item.refLineHeight =
    item.refLineHeight != null && item.refLineHeight != ""
      ? item.refLineHeight
      : 0.5;

  let width;
  if (!item.refLineShowVal) {
    width = rlWidths.rect;
  } else if (rlWidths.axisSwitch && rlWidths.axisPosition == "r") {
    width = rlWidths.rect + rlWidths.flagsContainer + rlWidths.axis + 20;
  } else {
    width = rlWidths.rect + rlWidths.flagsContainer + 20;
  }

  var refLine = group.append("g").attr("id", "refLine_" + item.cId);

  refLine
    .append("line")
    .style("stroke", item.refLineColor)
    .style("stroke-width", item.refLineHeight)
    .style("stroke-dasharray", item.refLineStrokeDashArr) //("3, 3"))
    .style("stroke-dashoffset", item.refLineSDashOffset)
    .attr("x1", 0)
    .attr("y1", scale(item.refLineVal))
    .attr("x2", width)
    .attr("y2", scale(item.refLineVal));

  refLine
    .append("text")
    .attr("x", width)
    .attr("y", scale(item.refLineVal))
    .attr("dy", ".35em")
    .text(
      item.refLineShowVal
        ? item.heatBar.refLineItemName +
            " " +
            item.refLinePre +
            item.refLineVal +
            item.refLinePost
        : null
    );

  return refLine;
};

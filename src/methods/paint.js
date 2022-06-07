import * as d3 from "d3";

import country from "../assets/flags/country";

import { createProps } from "../features/createProps";
import {
  createData,
  createSVGElem,
  defineGradients,
  manageAxis,
  createRefLine,
} from "../features/usefulMethods";

import { adjustFlags, createGroups } from "../features/flagsLogic";

import {
  createDiv,
  handleMouseover,
  handleClick,
  adjustRows,
} from "../features/adjustTooltip";

import "./style.css";

var qlik = window.require("qlik");

export default function paint($element, layout) {
  // console.log("Layout", layout);

  // Create data
  var mat = layout.qHyperCube.qDataPages[0].qMatrix,
    data = [],
    vals = [];
  createData(mat, country, data, vals);

  // Manage props
  const allProps = createProps(layout);

  // Initial stuffs
  const elementId = "heatBar_" + layout.qInfo.qId,
    containerWidth = $element.width(),
    containerHeight = $element.height();

  var margin = {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
    },
    width = containerWidth - margin.left - margin.right,
    height = containerHeight - margin.top - margin.bottom;

  // Create the SVG
  var svg = createSVGElem(elementId, width, height, margin);
  defineGradients(svg, elementId, allProps.barFColor, allProps.barSColor);

  var barWidth = allProps.barWidth,
    barHeight =
      allProps.barHeight != "" ? allProps.barHeight : height - margin.bottom, //should be height - margin.bottom
    barYpos = 0;

  // Create the rect
  var HB_Rect = svg
    .append("g")
    .attr("name", "bar")
    .append("rect")
    .attr("id", "heatBar_rect")
    .attr("x", 0)
    .attr("y", barYpos)
    .attr("rx", allProps.barBorders)
    .attr("width", barWidth)
    .attr("height", barHeight)
    .style("fill", "url(#gradient_" + elementId + ")");

  // Create reference line group
  var refLineGroup = svg.append("g").attr("id", "refLineGroup");

  // Scale
  let minScale = allProps.axisLValue != "" ? allProps.axisLValue : d3.min(vals),
    maxScale = allProps.axisHValue != "" ? allProps.axisHValue : d3.max(vals);

  var scale = d3
    .scaleLinear()
    .domain([minScale, maxScale])
    // .domain([d3.min(vals), d3.max(vals)])
    // .range([0, height - 100]);
    .range([height - margin.bottom, 0]);

  allProps.axisNice ? scale.nice() : null;

  // Axis
  manageAxis(
    elementId,
    svg,
    HB_Rect,
    allProps.axisSwitch,
    allProps.axisPosition,
    allProps.axisPercentage,
    scale,
    barHeight
  );

  var rectBbox = document
    .querySelector("#" + elementId + " g[name]") //name="bar"
    .getBBox();
  if (allProps.axisSwitch)
    var axisBbox = document.querySelector("#axis_" + elementId).getBBox();

  // Starting X of flag, calculated on axis l/r width
  var flagXPosition =
    rectBbox.width + (axisBbox != undefined ? axisBbox.width : 0) + 15;

  // Define divs for tooltips
  if ($(".hb-tooltip." + elementId).length)
    $(".hb-tooltip." + elementId).remove();
  if ($(".hb-tooltip-single." + elementId).length)
    $(".hb-tooltip-single." + elementId).remove();
  var div = createDiv("hb-tooltip " + elementId);
  var divPopup = createDiv("hb-tooltip-single " + elementId);

  // Click everywhere on page to hide the tooltip
  document.body.addEventListener("click", function () {
    if (
      document.querySelector(".hb-tooltip." + elementId).style.opacity == "1"
    ) {
      div
        .transition()
        .duration(100)
        .style("opacity", 0)
        .style("pointer-events", "none");
      document.querySelector(".hb-tooltip." + elementId).scrollTop = 0;
    }
  });

  // Flags
  var flagContainer = svg
    .append("g")
    .attr("id", "flagsContainer")
    .selectAll("g")
    .data(data.filter((d) => d.valText != "-"))
    .enter();

  var flagWidth = allProps.flagsInCircle ? 20 : 24,
    flagHeight = allProps.flagsInCircle ? 20 : 16,
    adjust = allProps.flagsInCircle ? 10 : 8;

  var flags = flagContainer
    .append("foreignObject")
    .attr("x", flagXPosition)
    .attr("y", function (d) {
      return scale(d.val) - adjust; // adjusting in height
    })
    .attr("width", flagWidth)
    .attr("height", flagHeight)
    .append("xhtml:img")
    .attr("width", flagWidth)
    .attr("height", flagHeight)
    .attr("src", function (d) {
      return allProps.flagsInCircle ? d.imgPath1x1 : d.imgPath;
    })
    .style("border-radius", allProps.flagsInCircle ? "50%" : 0)
    .on("click", function (e, d) {
      // Navigation on single flags
      var sheetNav = {
        sheetID: d.SheetNav,
        sheetSel: d.SheetSel,
        sheetClear: d.SheetClear,
      };
      if (sheetNav?.sheetID || sheetNav?.sheetSel || sheetNav?.sheetClear) {
        $(".hb-tooltip-single." + elementId).remove();
        qlik.fun.promiseNavigationHistory(
          sheetNav.sheetClear,
          sheetNav.sheetSel,
          sheetNav.sheetID,
          false
        );
      }
    })
    .on("mouseover", function (e, d) {
      handleMouseover(e, d, divPopup, allProps.tooltipTitle);
    })
    .on("mouseout", function (e, d) {
      divPopup.transition().duration(100).style("opacity", 0);
    });

  let gruppi = [];
  adjustFlags(
    elementId,
    data.filter((d) => d.valText != "-"),
    flagXPosition,
    flagWidth,
    flagHeight,
    gruppi
  );

  const gruppiTrue = gruppi.filter(
    (item) => item.hasGroup == true && item.group.length > 1
  );

  // console.log("gruppi", gruppi);
  // console.log("gruppiTrue", gruppiTrue);

  createGroups(gruppiTrue, allProps.iconShowMore);

  svg
    .selectAll("#" + elementId + " #dotted")
    .data(gruppiTrue)
    .on("click", function (e, d) {
      handleClick(
        e,
        d.group,
        div,
        elementId,
        allProps.tooltipTitle,
        allProps.tooltipTrim,
        allProps.tooltipMaxCols,
        qlik
      );
    });

  adjustRows(elementId, allProps.tooltipMaxRows, this.$scope);

  // allProps.tooltipImgWidth
  // Reference line
  if (layout.refLineArray.length) {
    let flagsContainerBbox = document
      .querySelector("#" + elementId + " #flagsContainer")
      .getBBox();

    let refLineWidths = {
      axisSwitch: allProps.axisSwitch,
      axisPosition: allProps.axisPosition,
      rect: rectBbox.width,
      flagsContainer: flagsContainerBbox.width,
      axis: axisBbox != undefined ? axisBbox.width : null,
    };

    layout.refLineArray.forEach((item) => {
      var refLine = createRefLine(refLineGroup, item, scale, refLineWidths);
      // Adjust refLine position if axis left
      if (allProps.axisPosition == "l") {
        refLine.attr("transform", "translate(" + (axisBbox.width + 10) + ",0)");
      }
    });
  }
}

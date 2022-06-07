import * as d3 from "d3";

export const isInViewport = (elementId) => {
  var el = document.querySelector(".hb-tooltip." + elementId);
  const rect = el.getBoundingClientRect();
  if (
    !(
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  ) {
    // console.log("not inViewport");
    el.style.top = rect.y - rect.height + "px";
  }
};

export const createDiv = (className) => {
  return d3
    .select("body")
    .append("div")
    .attr("class", className)
    .style("opacity", 0);
};

export const handleMouseover = (e, d, divPopup, tooltipTitle) => {
  if (d.name) {
    divPopup.transition().duration(100).style("opacity", 1);
    let temp =
      "<p>" + (tooltipTitle ? d.iso : d.name) + "</p><p>" + d.valText + "</p>";
    divPopup
      .html(temp)
      .style("left", e.pageX + 20 + "px")
      .style("top", e.pageY - 28 + "px");
  }
};

export const handleClick = (
  e,
  d,
  div,
  elementId,
  tooltipTitle,
  tooltipTrim,
  tooltipMaxCols,
  qlik
) => {
  div
    .transition()
    .duration(200)
    .style("opacity", 1)
    .style("pointer-events", "all");

  // Adjust grid cols template stand on group elements and max
  if (d.length == 2) {
    div.style("grid-template-columns", "repeat(2, 1fr)");
  } else if (d.length < tooltipMaxCols) {
    div.style("grid-template-columns", "repeat(" + d.length + ", 1fr)");
  } else {
    div.style("grid-template-columns", "repeat(" + tooltipMaxCols + ", 1fr)");
  }
  let temp = "";
  d.forEach((item) => {
    temp +=
      "<div class='hb-tooltip-group'><p>" +
      (tooltipTitle
        ? item.iso
        : tooltipTrim && item.name.length > 10
        ? item.iso
        : item.name) +
      "</p><img src=" +
      item.imgPath +
      "><p>" +
      item.valText +
      "</p></div>";
  });
  div
    .html(temp)
    .style("left", e.clientX + "px")
    .style("top", e.clientY + "px");
  isInViewport(elementId);

  d.forEach((item, i) => {
    $(".hb-tooltip." + elementId + " .hb-tooltip-group img")[
      i
    ].addEventListener("click", function (e) {
      // console.log("Clicked", item.name);
      var sheetNav = {
        sheetID: item.SheetNav,
        sheetSel: item.SheetSel,
        sheetClear: item.SheetClear,
      };
      if (sheetNav?.sheetID || sheetNav?.sheetSel || sheetNav?.sheetClear) {
        $(".hb-tooltip." + elementId + " .hb-tooltip-group").remove();
        qlik.fun.promiseNavigationHistory(
          sheetNav.sheetClear,
          sheetNav.sheetSel,
          sheetNav.sheetID,
          false
        );
      }
    });
  });
};

const waitForElm = (selector) => {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
};

export const adjustRows = (elementId, tooltipMaxRows, scope) => {
  waitForElm(".hb-tooltip." + elementId + "> div:first-child > img").then(
    (elm) => {
      // console.log("exists!");
      if (tooltipMaxRows != "") {
        elm.addEventListener("load", () => {
          scope.elementId = elementId;
          scope.setHeight = elm.parentNode.offsetHeight * tooltipMaxRows;
        });
      } else {
        scope.setHeight = "initial";
      }
    }
  );
};

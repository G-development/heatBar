/* FLAGS LOGIC */
export const adjustFlags = (
  elementId,
  data,
  flagXPosition,
  flagWidth,
  flagHeight,
  gruppi
) => {
  // Adjust overlapping flags position
  // Get all x/y values of each flag
  var flagsImgs = document.querySelectorAll(
    "#" + elementId + " #flagsContainer > foreignObject"
  );
  var imgs = document.querySelectorAll(
    "#" + elementId + " #flagsContainer > foreignObject > img"
  );
  var xyPos = [];
  flagsImgs.forEach((flag) => {
    xyPos.push({
      x: flag.x.baseVal.value,
      y: flag.y.baseVal.value,
      moved: false,
    });
  });

  // Structure to achieve:
  // [{
  //   countryName: italia,
  //   hasGroup: true,
  //   group: [
  //     {},
  //     {}
  //   ]
  // }, ...]

  let ultimaFlagStampata;

  for (let i = 0; i < xyPos.length; i++) {
    if (i == 0) {
      // console.log("stampo bandiera", xyPos[i].y);
      ultimaFlagStampata = 0;
      // console.log("ultimaFlagStampata", ultimaFlagStampata);
      gruppi.push({
        countryName: data[i].name,
        hasGroup: false,
        group: [],
        toHide: [],
      });
    } else {
      if (xyPos[i].y + flagHeight > xyPos[i - 1].y) {
        // console.log("Ulteriore controllo con la prima stampata");
        if (xyPos[i].y + flagHeight > xyPos[ultimaFlagStampata].y) {
          // console.log("E' sovrapposta");
          flagsImgs[i].setAttribute("x", flagXPosition + flagWidth);
          gruppi[gruppi.length - 1].hasGroup = true;
          gruppi[gruppi.length - 1].group.push(data[i]);
          gruppi[gruppi.length - 1].toHide.push(imgs[i]);
        } else {
          ultimaFlagStampata = i;
          // console.log("Img non sovrapposta", xyPos[i].y);
          gruppi.push({
            countryName: data[i].name,
            hasGroup: false,
            group: [],
            toHide: [],
          });
        }
      } else {
        ultimaFlagStampata = i;
        // console.log("update ultimaFlagStampata", ultimaFlagStampata);
        // console.log("stampo:", xyPos[i].y);
        gruppi.push({
          countryName: data[i].name,
          hasGroup: false,
          group: [],
          toHide: [],
        });
      }
    }
  }
};

export const createGroups = (gruppiTrue, iconShowMore) => {
  // Switch all flags to hidden and change the first with dotted img
  gruppiTrue.forEach((item) => {
    item.toHide.forEach((flag, index) => {
      if (index == 0) {
        flag.setAttribute("id", "dotted"); // + index);
        flag.src = iconShowMore;
      } else {
        flag.parentElement.style.display = "none";
      }
    });
  });
};

import {cpAbout, cpString, cpSwitch, cpButtonGroup, cpTextArea, cpArray, cpNumber} from './util'

var AxisPosOptions = [{
	value: "l",
	label: "← Left",
	tooltip: "Select for left positioning"
}, {
	value: "r",
	label: "Right →",
	tooltip: "Select for right positioning"
}];

var refLineArr = {
	refLineItemName: cpString("heatBar.refLineItemName", "Item name", "New item", ""),
	refLineVal: cpNumber("refLineVal", "Value", "", "number", "optional"),
	refLineShowVal: cpSwitch("refLineShowVal", "Show label / value", "Yes", "No", true),
	refLinePre:	cpString("refLinePre", "Pre value", "", "", null, null, function (data){ return data.refLineShowVal }),
	refLinePost: cpString("refLinePost", "Post value", "", "", null, null, function (data){ return data.refLineShowVal }),
	refLineHeight: cpString("refLineHeight", "Height", "", ""),
	refLineColor: cpString("refLineColor", "Color", "", "optional"),
	refLineSDashArr: cpString("refLineStrokeDashArr", "Stroke dasharray", "", ""),
	refLineSDashOffset: cpString("refLineSDashOffset", "Stroke dashoffset", "", ""),
}

export default {
	type: "items",
	component: "accordion",
	items: {
		dimensions: {
			uses: "dimensions",
			min: 1,
			max: 1,
		},
		measures: {
			uses: "measures",
			min: 1,
			max: 1,
			items: {
				// Navigation
				navSheet: cpString("qAttributeExpressions.0.qExpression", "Sheet Navigation", "", "always", "string", "expression"),
				navSel: cpString("qAttributeExpressions.1.qExpression", "Value to select(Field;value|Field;value:value:..)", "", "always", "string", "expression"),
				navClear: cpString("qAttributeExpressions.2.qExpression", "Value to clear(Field|Field)", "", "always", "string", "expression"),
			}
		},
		settings: {
			uses: "settings",
		},
		config: {
			type: "items",
			label: "Configuration",
			items:{
				// Insert component	
				allSettings: {
					uses: "addons",
					items: {
						// General
						generalSettings: {
							type: "items",
							label: "General",
							items: {
								flagsInCircle: cpSwitch("heatBar.flagsInCircle", "Flags in circle", "Yes", "No", false),
								iconShowMore: cpString("heatBar.iconShowMore", "Custom show more icon", "", ""),
								cssTextArea: cpTextArea("heatBar.cssTextArea", "More CSS", "", 7, 1000),
							}},
						// Bar settings
						barSettings: {
							type: "items",
							label: "Bar",
							items: {
								barWidth: cpString("heatBar.barWidth", "Bar width", "", "number"),
								barHeight: cpString("heatBar.barHeight", "Bar height", "", "number"),
								barFColor: cpString("heatBar.barFColor", "Gradient lowest color", "", ""),
								barSColor: cpString("heatBar.barSColor", "Gradient highest color", "", ""),
								barBorders: cpNumber("heatBar.barBorders", "Bar border-radius", "", "integer",),
							}},
						// Axis settings
						axisSettings: {
							type: "items",
							label: "Axis settings",
							items: {
								axisSwitch: cpSwitch("heatBar.axisSwitch", "Show axis", "Yes", "No", true),
								axisNice: cpSwitch("heatBar.axisNice", "Nice numbers", "Yes", "No", true, function (data){ return data.heatBar.axisSwitch }),
								axisPosition: cpButtonGroup("heatBar.axisPosition", "Position", "l", AxisPosOptions, function (data){ return data.heatBar.axisSwitch }),
								axisPercentage: cpString("heatBar.axisPercentage", "Percentage if(<>, true(), false())", "", "always",),
								axisLValue: cpNumber("heatBar.axisLValue", "Lowest value", "", "number", "optional", null, null, function (data){ return data.heatBar.axisSwitch }),
								axisHValue: cpNumber("heatBar.axisHValue", "Highest value", "", "number", "optional", null, null, function (data){ return data.heatBar.axisSwitch }),
							}},
						// Reference line settings
						refLineSettings: {
							type: "items",
							label: "Reference line",
							items: {
								refLineArray: cpArray("refLineArray", "Create LABEL", "heatBar.refLineItemName", "Create refLine", refLineArr),
							}},
						// Tooltip settings
						tooltipSettings: {
							type: "items",
							label: "Tooltip",
							items: {
								tooltipTitle: cpSwitch("heatBar.tooltipTitle", "Tooltip title", "ISO", "Country name", true),
								tooltipTrim: cpSwitch("heatBar.tooltipTrim", "Use ISO for long names", "Yes", "No", true, function (data){ return !data.heatBar.tooltipTitle }),
								tooltipMaxCols: cpString("heatBar.tooltipMaxCols", "Max. columns", "", ""),
								tooltipMaxRows: cpString("heatBar.tooltipMaxRows", "Max. rows", "", ""),
								tooltipImgWidth: cpString("heatBar.tooltipImgWidth", "Flag width", "", "")
							}},
					}
				}
			}
		
		},
		
		about: cpAbout("extension", "1.0.0"),
	},
}

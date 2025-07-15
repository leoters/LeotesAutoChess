"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ItemPicker;
const jsx_runtime_1 = require("react/jsx-runtime");
const i18next_1 = require("i18next");
const react_1 = require("react");
const react_tabs_1 = require("react-tabs");
const react_tooltip_1 = require("react-tooltip");
const Item_1 = require("../../../../../types/enum/Item");
const item_detail_1 = require("../../../game/components/item-detail");
const jsx_1 = require("../../utils/jsx");
function ItemPicker(props) {
    const [itemHovered, setItemHovered] = (0, react_1.useState)();
    function handleOnDragStart(e, item) {
        e.stopPropagation();
        e.dataTransfer.setData("text/plain", `item,${item}`);
    }
    const tabs = [
        { label: (0, i18next_1.t)("components"), key: "components", items: Item_1.ItemComponents },
        { label: (0, i18next_1.t)("craftable_items"), key: "craftable", items: Item_1.CraftableItems },
        { label: (0, i18next_1.t)("food"), key: "food", items: [...Item_1.Berries, Item_1.Item.TART_APPLE, Item_1.Item.SWEET_APPLE, Item_1.Item.SIRUPY_APPLE, Item_1.Item.CHEF_HAT] },
        { label: (0, i18next_1.t)("artificial_items"), key: "artificial", items: Item_1.ArtificialItems },
        {
            label: (0, i18next_1.t)("shiny_items"),
            key: "shiny_items",
            items: Item_1.ShinyItems
        },
        {
            label: (0, i18next_1.t)("special_items"),
            key: "special_items",
            items: [Item_1.Item.RUSTED_SWORD, Item_1.Item.TEAL_MASK, Item_1.Item.WELLSPRING_MASK, Item_1.Item.CORNERSTONE_MASK, Item_1.Item.HEARTHFLAME_MASK]
        }
    ];
    return ((0, jsx_runtime_1.jsxs)(react_tabs_1.Tabs, { className: "my-box", id: "item-picker", children: [(0, jsx_runtime_1.jsx)(react_tabs_1.TabList, { children: tabs.map((t) => ((0, jsx_runtime_1.jsx)(react_tabs_1.Tab, { children: t.label }, t.key))) }), tabs.map((t) => ((0, jsx_runtime_1.jsx)(react_tabs_1.TabPanel, { children: t.items.map((item) => ((0, jsx_runtime_1.jsx)("img", { src: "assets/item/" + Item_1.Item[item] + ".png", className: (0, jsx_1.cc)("item", {
                        selected: item === props.selected
                    }), "data-tooltip-id": "item-detail", onMouseOver: () => setItemHovered(item), onClick: () => props.selectEntity(item), draggable: true, onDragStart: (e) => handleOnDragStart(e, item) }, item))) }, t.key))), itemHovered && (0, jsx_runtime_1.jsx)(react_tooltip_1.Tooltip, { id: "item-detail", className: "custom-theme-tooltip item-detail-tooltip", float: true, children: (0, jsx_runtime_1.jsx)(item_detail_1.ItemDetailTooltip, { item: itemHovered }) })] }));
}
//# sourceMappingURL=item-picker.js.map
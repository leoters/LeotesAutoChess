"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MetaReport;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_tabs_1 = require("react-tabs");
const react_i18next_1 = require("react-i18next");
const item_report_1 = require("./item-report");
const pokemon_report_1 = require("./pokemon-report");
const metadata_report_1 = __importDefault(require("./metadata-report"));
require("./meta-report.css");
function MetaReport() {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsx)("div", { id: "meta-report", children: (0, jsx_runtime_1.jsxs)(react_tabs_1.Tabs, { children: [(0, jsx_runtime_1.jsxs)(react_tabs_1.TabList, { children: [(0, jsx_runtime_1.jsx)(react_tabs_1.Tab, { children: t("pokemon_report") }, "pokemons"), (0, jsx_runtime_1.jsx)(react_tabs_1.Tab, { children: t("item_report") }, "items"), (0, jsx_runtime_1.jsx)(metadata_report_1.default, {})] }), (0, jsx_runtime_1.jsx)(react_tabs_1.TabPanel, { children: (0, jsx_runtime_1.jsx)(pokemon_report_1.PokemonReport, {}) }), (0, jsx_runtime_1.jsx)(react_tabs_1.TabPanel, { children: (0, jsx_runtime_1.jsx)(item_report_1.ItemReport, {}) })] }) }));
}
//# sourceMappingURL=meta-report.js.map
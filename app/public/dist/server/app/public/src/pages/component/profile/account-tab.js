"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountTab = AccountTab;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const hooks_1 = require("../../../hooks");
const NetworkStore_1 = require("../../../stores/NetworkStore");
const types_1 = require("../../../../../types");
function AccountTab() {
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatch = (0, hooks_1.useAppDispatch)();
    const user = (0, hooks_1.useAppSelector)((state) => state.network.profile);
    const promptDeleteAccount = () => {
        const confirmation = prompt(t("delete_account_confirmation"));
        if (confirmation === t("delete_account_passphrase")) {
            dispatch((0, NetworkStore_1.deleteAccount)());
        }
        else if (confirmation != null) {
            alert(t("delete_account_confirmation_failed"));
        }
    };
    return user ? ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(ChangeNameForm, {}), (0, jsx_runtime_1.jsx)("h3", { children: t("user_id") }), (0, jsx_runtime_1.jsxs)("p", { children: [t("user_id_hint1"), " ", (0, jsx_runtime_1.jsx)("span", { style: { color: "red" }, children: user.uid })] }), (0, jsx_runtime_1.jsx)("p", { children: t("user_id_hint2") }), (0, jsx_runtime_1.jsx)("h3", { children: t("delete_account") }), (0, jsx_runtime_1.jsx)("p", { children: t("delete_account_hint") }), (0, jsx_runtime_1.jsx)("button", { className: "bubbly red", onClick: () => promptDeleteAccount(), children: t("delete_account") })] })) : null;
}
function ChangeNameForm() {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [inputValue, setInputValue] = (0, react_1.useState)("");
    const dispatch = (0, hooks_1.useAppDispatch)();
    const user = (0, hooks_1.useAppSelector)((state) => state.network.profile);
    const isAnonymous = false;
    function tryChangeName(newName) {
        newName = newName.replace(/[\u3164\u200B-\u200D\u2060\uFEFF]/g, "");
        if (types_1.USERNAME_REGEXP.test(newName)) {
            dispatch((0, NetworkStore_1.changeName)(newName));
        }
        else {
            dispatch((0, NetworkStore_1.setErrorAlertMessage)(t("invalid_username")));
        }
    }
    if (user && isAnonymous) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "my-container", children: (0, jsx_runtime_1.jsx)("p", { children: t("anonymous_users_name_hint") }) }));
    }
    return user ? ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { children: t("change_name") }), (0, jsx_runtime_1.jsxs)("div", { style: { display: "flex", gap: "0.5em" }, children: [(0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: user.displayName, onChange: (e) => {
                            setInputValue(e.target.value);
                        } }), (0, jsx_runtime_1.jsx)("button", { className: "bubbly blue", onClick: () => tryChangeName(inputValue), children: t("change") })] }), (0, jsx_runtime_1.jsx)("p", { className: "disclaimer", children: t("username_disclaimer") })] })) : null;
}
//# sourceMappingURL=account-tab.js.map
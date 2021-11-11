import React from "react";
import ReactDOM from "react-dom";
import {
    AdaptivityProvider,
    ConfigProvider,
    useAdaptivity,
    AppRoot,
    SplitLayout,
    SplitCol,
    ViewWidth,
    View,
    Panel,
    PanelHeader,
    Group,
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";
import Calc from "./App";

const App = () => {
    const { viewWidth } = useAdaptivity();

    return (
        <AppRoot>
            <SplitLayout header={<PanelHeader separator={false} />}>
                <SplitCol spaced={viewWidth && viewWidth > ViewWidth.MOBILE}>
                    <View activePanel="main">
                        <Panel id="main">
                            <PanelHeader>IP Калькулятор ЭПИ-21</PanelHeader>
                            <Group>
                                <Calc/>
                            </Group>
                        </Panel>
                    </View>
                </SplitCol>
            </SplitLayout>
        </AppRoot>
    );
};

ReactDOM.render(
    <ConfigProvider>
        <AdaptivityProvider>
            <App />
        </AdaptivityProvider>
    </ConfigProvider>,
    document.getElementById("root")
);

import { FC, Fragment } from "react";
import { Route, Routes } from "react-router-dom";
import NotFoundPC from "./pageComponents/NotFound.pc";

const pageNameToExports = import.meta.glob<true, string, { default: FC; }>("/src/pages/**/*.tsx", { eager: true });

interface PageRoute {
    path: string;
    route: string;
    Component: FC;
    children: PageRoute[];
}
const pageRoutesEmptyFlat = Object.keys(pageNameToExports).map(route => {
    const path = route
        .replace(/\/src\/pages|(index|Index)|(<|>)(\/?)|\.tsx$/g, "")
        .replace(/\[\.{3}.+\]/, "*")
        .replace(/\[([^\]]+)\]/g, ":$1");
    const pageRoute: PageRoute = {
        path,
        route,
        Component: pageNameToExports[route].default,
        children: [],
    };
    return pageRoute;
});

const pageRoutesEmpty: PageRoute[][] = [];
pageRoutesEmptyFlat.forEach(pr => {
    const { route } = pr;
    const level = (route.match(/>/g) ?? []).length;
    while (pageRoutesEmpty.length - 1 < level) pageRoutesEmpty.push([]);
    pageRoutesEmpty[level].push(pr);
});
for (let i = pageRoutesEmpty.length - 1; i > 0; i--) {
    const children = pageRoutesEmpty[i];
    const parents = pageRoutesEmpty[i - 1];
    children.forEach(c => {
        const { route } = c;
        const parentStart = route.substring(0, route.lastIndexOf('>')) + '<';
        const parent = parents.find(p => p.route.includes(parentStart));
        if (!parent) throw '';
        parent.children.push(c);
    })
}
const [pageRoutes] = pageRoutesEmpty;

const getRoute = (pageRoute: PageRoute) => {
    const { path, Component = Fragment, children } = pageRoute;
    return (
        <Route key={path} path={path} element={<Component />}>
            {children.map(getRoute)}
        </Route>
    )
};

export const AppRoutes = () => (
    <Routes>
        {pageRoutes.map(getRoute)}
        <Route path="*" element={<NotFoundPC />} />
    </Routes>
);

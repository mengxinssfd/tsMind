/**
 * @Author: mengxinssfd
 * @Date: 2019-10-24 15:22
 * @Description:
 */

import {TsMind} from "../index";

const tm = new TsMind({
    el: ".container",
    editable: false,
    line: {
        color: "",
        width: 1
    },
    mode: "html"
});

tm.setData({
    id: "root",
    content: "root",
    children: [
        {
            id: "sub1",
            content: "sub1",
        },
        {
            id: "sub2",
            content: "sub2",
        }
    ],
});
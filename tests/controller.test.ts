(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};
import { DocController } from "../src/doc_controller";
test("check font size ", () => {
    let options: any = {
        orientation: "l",
        fontSize: 12,
        margins:
        {
            left: 10,
            right: 10,
            top: 10,
            bot: 10

        }
    };
    const controller = new DocController(options);
    expect(controller.fontSize).toBe(12);
});
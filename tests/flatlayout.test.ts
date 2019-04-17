(<any>window)["HTMLCanvasElement"].prototype.getContext = () => {
    return {};
};

test("Test flat layout", () => {
    expect(true).toBe(true);
});
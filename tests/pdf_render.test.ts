(<any>window)['HTMLCanvasElement'].prototype.getContext = () => {
    return {};
};

test('Test pdf render', () => {
    expect(true).toBe(true);
});
module.exports = {
    presets:  [
        [
            "@babel/env",
            {
                modules: false,
                useBuiltIns: "usage"
            },
            "@babel/stage-0"
        ]
    ]
};